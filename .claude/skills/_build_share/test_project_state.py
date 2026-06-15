#!/usr/bin/env python3
"""Tests for the documentation-drift detector in project-state.py.

Stdlib `unittest` only — the scanner is deliberately stdlib-only so its tests
must be too (run: `python3 -m unittest test_project_state` from this dir, or
`python3 .claude/skills/_build_share/test_project_state.py`).

The drift detector is git-aware (last-change time, not mtime), so each test
builds a throwaway git repo with controlled commit dates.
"""
import importlib.util
import json
import os
import subprocess
import tempfile
import unittest

_HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location(
    "project_state", os.path.join(_HERE, "project-state.py")
)
ps = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ps)

T1 = "2026-01-01 12:00:00 +0000"
T2 = "2026-02-01 12:00:00 +0000"  # strictly later than T1
T3 = "2026-03-01 12:00:00 +0000"
T4 = "2026-04-01 12:00:00 +0000"


def _run(cwd, *args, env=None):
    e = dict(os.environ)
    if env:
        e.update(env)
    subprocess.run(args, cwd=cwd, check=True, capture_output=True, text=True, env=e)


def _git_init(root):
    _run(root, "git", "init", "-q")
    _run(root, "git", "config", "user.email", "t@t.test")
    _run(root, "git", "config", "user.name", "Test")


def _commit_all(root, message, when):
    """Stage everything and commit at a fixed author+committer date."""
    _run(root, "git", "add", "-A")
    _run(root, "git", "commit", "-q", "-m", message,
         env={"GIT_AUTHOR_DATE": when, "GIT_COMMITTER_DATE": when})


def _write(root, rel, text):
    p = os.path.join(root, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w", encoding="utf-8") as f:
        f.write(text)


def _ai_doc(human_summary=None, body="# Doc\nbody\n"):
    fm = ["---", "slug: demo", "stage: prd", "status: complete"]
    if human_summary:
        fm.append(f"human_summary: {human_summary}")
    fm.append("---")
    return "\n".join(fm) + "\n\n" + body


def _doc(fm, body="# Doc\nbody\n"):
    lines = ["---"]
    for k, v in fm.items():
        lines.append(f"{k}: [{', '.join(v)}]" if isinstance(v, list) else f"{k}: {v}")
    lines.append("---")
    return "\n".join(lines) + "\n\n" + body


class ComputeDriftTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = self._tmp.name
        _git_init(self.root)

    def tearDown(self):
        self._tmp.cleanup()

    def _kinds(self):
        return sorted(d["kind"] for d in ps.compute_drift(self.root))

    def test_in_sync_mirror_has_no_drift(self):
        _write(self.root, ".ai/specs/demo/prd.md", _ai_doc(".human/specs/demo/prd.md"))
        _write(self.root, ".human/specs/demo/prd.md", "# Human PRD\n")
        _commit_all(self.root, "init in sync", T1)
        self.assertEqual(ps.compute_drift(self.root), [])

    def test_stale_mirror_when_source_committed_after(self):
        _write(self.root, ".ai/specs/demo/prd.md", _ai_doc(".human/specs/demo/prd.md"))
        _write(self.root, ".human/specs/demo/prd.md", "# Human PRD\n")
        _commit_all(self.root, "init", T1)
        _write(self.root, ".ai/specs/demo/prd.md",
               _ai_doc(".human/specs/demo/prd.md", body="# Doc\nCHANGED\n"))
        _commit_all(self.root, "edit source only", T2)
        drift = ps.compute_drift(self.root)
        self.assertEqual([d["kind"] for d in drift], ["stale-mirror"])
        self.assertEqual(drift[0]["source"], ".ai/specs/demo/prd.md")
        self.assertEqual(drift[0]["target"], ".human/specs/demo/prd.md")
        self.assertIn("/prd", drift[0]["fix"])

    def test_uncommitted_source_edit_is_stale(self):
        _write(self.root, ".ai/specs/demo/prd.md", _ai_doc(".human/specs/demo/prd.md"))
        _write(self.root, ".human/specs/demo/prd.md", "# Human PRD\n")
        _commit_all(self.root, "init in sync", T1)
        # working-tree edit, not committed -> source is newest
        _write(self.root, ".ai/specs/demo/prd.md",
               _ai_doc(".human/specs/demo/prd.md", body="# Doc\nWIP\n"))
        self.assertEqual(self._kinds(), ["stale-mirror"])

    def test_missing_mirror_is_flagged(self):
        _write(self.root, ".ai/specs/demo/prd.md", _ai_doc(".human/specs/demo/prd.md"))
        _commit_all(self.root, "source only, no mirror", T1)
        drift = ps.compute_drift(self.root)
        self.assertEqual([d["kind"] for d in drift], ["missing-mirror"])
        self.assertEqual(drift[0]["target"], ".human/specs/demo/prd.md")

    def test_doc_without_human_summary_is_ignored(self):
        _write(self.root, ".ai/specs/demo/plan.md", _ai_doc(human_summary=None))
        _commit_all(self.root, "plan never mirrors", T1)
        self.assertEqual(ps.compute_drift(self.root), [])

    def test_coherence_report_is_folded_in(self):
        _write(self.root, ".ai/specs/demo/prd.md", _ai_doc(".human/specs/demo/prd.md"))
        _write(self.root, ".human/specs/demo/prd.md", "# Human PRD\n")
        _commit_all(self.root, "in sync", T1)
        _write(self.root, "dashboard/coherence.json", json.dumps({
            "findings": [{
                "detail": "design names a component the architecture does not list",
                "source": ".ai/specs/demo/design.md",
                "target": ".ai/architecture/02-components.md",
                "fix": "/coherence-check",
            }]
        }))
        drift = ps.compute_drift(self.root)
        self.assertEqual([d["kind"] for d in drift], ["spec-drift"])
        self.assertEqual(drift[0]["source"], ".ai/specs/demo/design.md")
        self.assertEqual(drift[0]["fix"], "/coherence-check")

    def test_malformed_coherence_report_fails_open(self):
        _write(self.root, "dashboard/coherence.json", "{ not valid json ")
        self.assertEqual(ps.compute_drift(self.root), [])

    def test_missing_mirror_detected_without_git(self):
        # A non-git directory: missing-mirror is pure fs (still works); the
        # freshness comparison is skipped (fail-open, no false stale).
        d = tempfile.TemporaryDirectory()
        try:
            _write(d.name, ".ai/specs/demo/prd.md", _ai_doc(".human/specs/demo/prd.md"))
            self.assertEqual([x["kind"] for x in ps.compute_drift(d.name)],
                             ["missing-mirror"])
        finally:
            d.cleanup()


class PremiseDriftTest(unittest.TestCase):
    """premise-drift: an upstream .ai doc changed after a downstream doc that
    declares it as a source was last generated (mechanical, no LLM)."""

    _PRD = ".ai/specs/demo/prd.md"
    _DESIGN = ".ai/specs/demo/design.md"

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = self._tmp.name
        _git_init(self.root)

    def tearDown(self):
        self._tmp.cleanup()

    def _premise(self):
        return [d for d in ps.compute_drift(self.root) if d["kind"] == "premise-drift"]

    def _design(self):
        return _doc({"slug": "demo", "stage": "design", "source_prd": self._PRD})

    def test_upstream_changed_after_downstream_flags_premise(self):
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="v1"))
        _commit_all(self.root, "prd v1", T1)
        _write(self.root, self._DESIGN, self._design())
        _commit_all(self.root, "design", T2)
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="v2 CHANGED"))
        _commit_all(self.root, "prd v2", T3)
        drift = self._premise()
        self.assertEqual(len(drift), 1)
        self.assertEqual(drift[0]["source"], self._PRD)
        self.assertEqual(drift[0]["target"], self._DESIGN)
        self.assertIn("/design demo", drift[0]["fix"])

    def test_no_premise_when_upstream_older(self):
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="v1"))
        _commit_all(self.root, "prd v1", T1)
        _write(self.root, self._DESIGN, self._design())
        _commit_all(self.root, "design", T2)
        self.assertEqual(self._premise(), [])

    def test_premise_clears_after_downstream_regenerated(self):
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="v1"))
        _commit_all(self.root, "prd v1", T1)
        _write(self.root, self._DESIGN, self._design())
        _commit_all(self.root, "design", T2)
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="v2 CHANGED"))
        _commit_all(self.root, "prd v2", T3)
        self.assertEqual(len(self._premise()), 1)
        _write(self.root, self._DESIGN, _doc({"slug": "demo", "stage": "design", "source_prd": self._PRD},
                                             body="design regenerated"))
        _commit_all(self.root, "design regenerated", T4)
        self.assertEqual(self._premise(), [])

    def test_upstream_change_then_revert_not_flagged(self):
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="AAA"))
        _commit_all(self.root, "prd AAA", T1)
        _write(self.root, self._DESIGN, self._design())
        _commit_all(self.root, "design", T2)
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="BBB"))
        _commit_all(self.root, "prd BBB", T3)
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="AAA"))
        _commit_all(self.root, "prd back to AAA", T4)
        self.assertEqual(self._premise(), [])

    def test_uncommitted_upstream_edit_flags_premise(self):
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="v1"))
        _commit_all(self.root, "prd v1", T1)
        _write(self.root, self._DESIGN, self._design())
        _commit_all(self.root, "design", T2)
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="v2 uncommitted"))
        self.assertEqual([d["kind"] for d in self._premise()], ["premise-drift"])

    def test_directory_source_is_ignored(self):
        _write(self.root, self._PRD, _doc({"slug": "demo", "stage": "prd"}, body="v1"))
        _write(self.root, ".ai/architecture/index.md", "# Arch\nv1\n")
        _commit_all(self.root, "prd + arch", T1)
        _write(self.root, self._DESIGN,
               _doc({"slug": "demo", "stage": "design",
                     "sources": [".ai/architecture", self._PRD]}))
        _commit_all(self.root, "design", T2)
        _write(self.root, ".ai/architecture/index.md", "# Arch\nv2 CHANGED\n")
        _commit_all(self.root, "arch v2", T3)
        self.assertEqual(self._premise(), [])


class ParseFeaturesTableTest(unittest.TestCase):
    """The features-table parser must read the chain's real `.ai/features.md`.

    `/feature-map` writes the in-scope table with an `id` identifier column
    (`| id | title | priority | status | ... |`); earlier formats used `slug`.
    The parser must accept either, key off a `status` column to find the table,
    and ignore sibling tables (e.g. the Deferred table) that lack `status`.
    """

    _ID_TABLE = (
        "# Features\n\n## In scope\n\n"
        "| id | title | priority | status | tier | depends_on | satisfies |\n"
        "| :-- | :-- | :-- | :-- | :-- | :-- | :-- |\n"
        "| system-map | Architecture tab | P0 | building | mvp | — | DeriveProjectState |\n"
        "| pr-handoff | PR creation | — | shipped | mvp | worktree-isolation | ServeApiAndWs |\n"
        "\n## Deferred\n"
        "| id | revisit | reason |\n"
        "| :-- | :-- | :-- |\n"
        "| cross-project-orchestrator | 2026-12-31 | routed out of scope |\n"
    )

    def test_parses_id_header_table(self):
        rows = ps.parse_features_table(self._ID_TABLE)
        self.assertEqual([r["slug"] for r in rows], ["system-map", "pr-handoff"])
        self.assertEqual(rows[0]["status"], "Building")
        self.assertEqual(rows[1]["status"], "Shipped")
        self.assertEqual(rows[0]["priority"], "P0")

    def test_ignores_sibling_table_without_status_column(self):
        # The Deferred table has an `id` column but no `status` column, so it
        # must not be mistaken for the feature roster.
        slugs = [r["slug"] for r in ps.parse_features_table(self._ID_TABLE)]
        self.assertNotIn("cross-project-orchestrator", slugs)

    def test_parses_slug_header_table(self):
        # Backward compatibility with the older `slug`-column format.
        text = (
            "| slug | title | status |\n"
            "| :-- | :-- | :-- |\n"
            "| alpha | Alpha | shipped |\n"
        )
        rows = ps.parse_features_table(text)
        self.assertEqual([r["slug"] for r in rows], ["alpha"])
        self.assertEqual(rows[0]["status"], "Shipped")

    def test_parses_feature_header_table(self):
        text = (
            "| feature | status |\n"
            "| :-- | :-- |\n"
            "| beta | building |\n"
        )
        rows = ps.parse_features_table(text)
        self.assertEqual([r["slug"] for r in rows], ["beta"])
        self.assertEqual(rows[0]["status"], "Building")

    def test_strips_backticks_from_identifier(self):
        text = (
            "| id | status |\n"
            "| :-- | :-- |\n"
            "| `gamma` | shipped |\n"
        )
        self.assertEqual(ps.parse_features_table(text)[0]["slug"], "gamma")

    def test_parses_mixed_case_and_padded_header(self):
        # Detection lower-cases and strips header cells; a refactor dropping
        # either would silently reintroduce the empty-roster bug.
        text = (
            "|  ID  | Title |  Status  |\n"
            "| :-- | :-- | :-- |\n"
            "| sys | Sys | Building |\n"
        )
        rows = ps.parse_features_table(text)
        self.assertEqual([r["slug"] for r in rows], ["sys"])
        self.assertEqual(rows[0]["status"], "Building")

    def test_skips_status_less_table_that_precedes_the_roster(self):
        # The roster need not be the first table: leading status-less tables
        # must be walked past without latching `in_table`.
        text = (
            "## Deferred\n"
            "| id | revisit | reason |\n"
            "| :-- | :-- | :-- |\n"
            "| later | 2026-12-31 | out of scope |\n"
            "\n## In scope\n"
            "| id | title | status |\n"
            "| :-- | :-- | :-- |\n"
            "| real | Real | building |\n"
        )
        self.assertEqual([r["slug"] for r in ps.parse_features_table(text)], ["real"])

    def test_skips_row_with_empty_identifier(self):
        # An empty slug would feed scan_features a phantom `.ai/specs//...` path.
        text = (
            "| id | status |\n"
            "| :-- | :-- |\n"
            "|  | shipped |\n"
            "| good | building |\n"
        )
        self.assertEqual([r["slug"] for r in ps.parse_features_table(text)], ["good"])

    def test_no_table_returns_empty(self):
        self.assertEqual(ps.parse_features_table("# Doc\n\nno tables here\n"), [])


class NormalizeStatusTest(unittest.TestCase):
    """normalize_status must map every status `ai-schema.md` declares valid.

    `deprecated` and `removed` are valid feature statuses (features.md:62,
    ai-schema.md) that /status renders distinctly; left unmapped they collapse
    to 'Unknown' and mis-render as a skipped badge (scc-q81).
    """

    def test_maps_deprecated_and_removed(self):
        self.assertEqual(ps.normalize_status("deprecated"), "Deprecated")
        self.assertEqual(ps.normalize_status("removed"), "Removed")

    def test_deprecated_removed_are_case_insensitive(self):
        self.assertEqual(ps.normalize_status("Deprecated"), "Deprecated")
        self.assertEqual(ps.normalize_status("REMOVED"), "Removed")

    def test_genuinely_unknown_status_still_maps_to_unknown(self):
        self.assertEqual(ps.normalize_status("frobnicated"), "Unknown")


class SliceBackendStatusTest(unittest.TestCase):
    """scc-934: a slice is 'merged' when its beads ticket is closed, even though
    the frozen canonical frontmatter only ever says open/published/removed. Done
    is a runtime backend fact (build/SKILL.md), so the generator consults the
    backend and writes the derived status into state.json only — never the file.
    """

    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = self._tmp.name
        self._orig_closed = ps.closed_backend_ids

    def tearDown(self):
        ps.closed_backend_ids = self._orig_closed
        self._tmp.cleanup()

    def _slice(self, num, beads, status="published", depends_on=None):
        deps = depends_on or []
        fm = [
            "---", "slug: demo", "feature: demo", f"slice: {num}",
            f"status: {status}", f"title: Slice {num}",
            f"depends_on: [{', '.join(str(d) for d in deps)}]",
            "backend_refs:", f"  beads: {beads}", "  jira: null", "  md: null",
            "---", "", "## What to build", "body",
        ]
        _write(self.root, f".ai/specs/demo/issues/SLICE-{num}.md", "\n".join(fm) + "\n")

    def test_derive_returns_merged_when_backend_closed(self):
        # The pure rule: a closed bead makes the slice merged regardless of the
        # frozen 'published' frontmatter and an empty ticket status log.
        self.assertEqual(
            ps.derive_slice_status("published", None, [], set(), is_backend_merged=True),
            "merged",
        )

    def test_derive_unchanged_without_backend_signal(self):
        # The default (no backend merge) preserves the prior file-only behavior.
        self.assertEqual(ps.derive_slice_status("published", None, [], set()), "published")
        self.assertEqual(ps.derive_slice_status("published", None, ["SLICE-9"], set()), "blocked")

    def test_scan_marks_slice_with_closed_bead_as_merged(self):
        self._slice(1, "scc-aaa")
        ps.closed_backend_ids = lambda root: {"scc-aaa"}
        [s1] = ps.scan_slices(self.root, "demo")
        self.assertEqual(s1["status"], "merged")

    def test_backend_merge_unblocks_dependents(self):
        # SLICE-2 depends on SLICE-1; once SLICE-1's bead is closed (merged),
        # SLICE-2 is no longer blocked even though its own bead is still open.
        self._slice(1, "scc-aaa")
        self._slice(2, "scc-bbb", depends_on=[1])
        ps.closed_backend_ids = lambda root: {"scc-aaa"}
        slices = {s["id"]: s for s in ps.scan_slices(self.root, "demo")}
        self.assertEqual(slices["SLICE-1"]["status"], "merged")
        self.assertEqual(slices["SLICE-2"]["status"], "published")

    def test_open_bead_leaves_published_slice_published(self):
        self._slice(1, "scc-aaa")
        ps.closed_backend_ids = lambda root: set()  # nothing closed
        [s1] = ps.scan_slices(self.root, "demo")
        self.assertEqual(s1["status"], "published")

    def test_closed_backend_ids_degrades_without_beads(self):
        # No .beads store (and/or no bd CLI) -> empty set, never a crash. Keeps
        # the generator runnable on any project (it falls back to the file view).
        self.assertEqual(ps.closed_backend_ids(self.root), set())


if __name__ == "__main__":
    unittest.main()
