#!/usr/bin/env python3
"""project-state.py — the shared read-only state engine for /status and /next.

Walks this chain's foundation + per-feature artifacts (.ai/**, tickets/, fitness/,
git) and writes `dashboard/state.json` — the single spine both /status (text lens)
and /next (boundary grill) read. With --html it ALSO renders a self-contained
`dashboard/index.html` (the visual lens folded into /status --html).

Stdlib only (python3) — the same runtime the rest of the suite's tooling uses, so
it runs uniformly on ANY target-project language (Node, Python, Go, …). It never
parses project source or invokes a project build; it reads markdown + git metadata.

Usage:
    python3 project-state.py [ROOT] [--html]
      ROOT    project root (default: current directory)
      --html  also write dashboard/index.html

Read-only: never mutates specs, plan, issues, tracker records, or source.
"""
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from functools import lru_cache

# ---------------- frontmatter (minimal YAML-ish, mirrors scan.ts) ----------------

def parse_yamlish(body):
    """key: scalar | key: [a,b] | key:\\n  - a | key:\\n  sub: v (-> 'key.sub')."""
    out = {}
    lines = body.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        i += 1
        if not line.strip() or line.strip().startswith("#"):
            continue
        m = re.match(r"^([\w-]+)\s*:\s*(.*)$", line)
        if not m:
            continue
        key, rest = m.group(1), m.group(2).strip()
        if rest == "":
            peek = lines[i] if i < len(lines) else ""
            if re.match(r"^\s*-\s+", peek):
                lst = []
                while i < len(lines) and re.match(r"^\s*-\s+", lines[i]):
                    item = re.sub(r"^\s*-\s+", "", lines[i]).strip().strip("\"'")
                    if item:
                        lst.append(item)
                    i += 1
                out[key] = lst
            elif re.match(r"^\s+[\w-]+\s*:", peek):
                while i < len(lines) and re.match(r"^\s+[\w-]+\s*:", lines[i]):
                    sub = re.match(r"^\s*([\w-]+)\s*:\s*(.*)$", lines[i].strip())
                    i += 1
                    if not sub:
                        continue
                    out[f"{key}.{sub.group(1)}"] = sub.group(2).strip().strip("\"'")
            else:
                out[key] = ""
        elif rest.startswith("[") and rest.endswith("]"):
            out[key] = [s.strip().strip("\"'") for s in rest[1:-1].split(",") if s.strip()]
        elif rest in ("true", "false"):
            out[key] = rest == "true"
        else:
            out[key] = rest.strip("\"'")
    return out


def read_frontmatter_text(text):
    m = re.match(r"^---\n(.*?)\n---", text, re.S)
    return parse_yamlish(m.group(1)) if m else {}


def read_frontmatter(path):
    return read_frontmatter_text(read(path))


def as_string(v):
    if isinstance(v, str):
        return v
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    return ""


def as_list(v):
    if isinstance(v, list):
        return [str(x) for x in v]
    if isinstance(v, str) and v.strip():
        return [v.strip()]
    return []


# ---------------- fs helpers ----------------

def read(path):
    with open(path, encoding="utf-8") as f:
        return f.read()


def exists(root, sub):
    return os.path.exists(os.path.join(root, sub))


def is_dir(p):
    return os.path.isdir(p)


def walk_files(d):
    for dirpath, _dirs, files in os.walk(d):
        for name in files:
            yield os.path.join(dirpath, name)


def list_files(root, sub, ext):
    d = os.path.join(root, sub)
    if not os.path.exists(d):
        return []
    return sorted(os.path.relpath(p, root) for p in walk_files(d) if p.endswith(ext))


# ---------------- foundation ----------------

def read_anchor(root):
    path = os.path.join(root, ".ai", "anchor.md")
    if not os.path.exists(path):
        return {"present": False, "tier": "unknown", "projectType": "unknown", "language": "unknown"}
    fm = read_frontmatter(path)
    return {
        "present": True,
        "tier": as_string(fm.get("project_tier")) or "unknown",
        "projectType": as_string(fm.get("project_type")) or "unknown",
        "language": as_string(fm.get("language")) or "unknown",
    }


def read_architect(root):
    single = exists(root, ".ai/architecture.md")
    bundle = exists(root, ".ai/architecture") and is_dir(os.path.join(root, ".ai/architecture"))
    if not single and not bundle:
        return {"present": False, "bundled": False, "adrCount": 0}
    adr_dir = os.path.join(root, ".ai/architecture/adr")
    adr_count = len([f for f in os.listdir(adr_dir) if f.endswith(".md")]) if is_dir(adr_dir) else 0
    return {"present": True, "bundled": bundle, "adrCount": adr_count}


def read_bootstrap(root):
    path = os.path.join(root, ".ai/bootstrap.md")
    if not os.path.exists(path):
        return {"present": False, "complete": False}
    fm = read_frontmatter(path)
    return {"present": True, "complete": as_string(fm.get("status")) == "complete"}


def scan_foundation(root):
    # optional Stage-1 product strategy (/strategy) — sharded by slug like
    # discovery/understanding, so glob the subdir; a flat exists() would miss it.
    strategy = list_files(root, ".ai/strategy", ".md")
    discovery = list_files(root, ".ai/discovery", ".md")
    understanding = list_files(root, ".ai/understanding", ".md")
    return {
        "strategy": {"present": len(strategy) > 0, "files": strategy},
        "discover": {"present": len(discovery) > 0, "files": discovery},
        "understand": {
            "present": len(understanding) > 0,
            "files": understanding,
            # reconciled: the shared domain context lives at .ai/context.md (was CONTEXT.md)
            "hasContext": exists(root, ".ai/context.md"),
        },
        "eventStorm": {"present": exists(root, ".ai/architecture/domain-model.md")},
        "featureMap": {"present": exists(root, ".ai/features.md")},
        "anchor": read_anchor(root),
        "dddStrategy": {"present": exists(root, ".ai/architecture/strategic-design.md")},
        "architect": read_architect(root),
        "bootstrap": read_bootstrap(root),
        "explore": {"present": exists(root, ".ai/recon.md")},
    }


# ---------------- features ----------------

def normalize_status(s):
    v = (s or "").strip()
    table = [
        (r"^planned$", "Planned"), (r"^building$", "Building"),
        (r"^(qa-approved|qa)$", "QA-Approved"), (r"^shipped$", "Shipped"),
        (r"^deprecated$", "Deprecated"), (r"^removed$", "Removed"),
        (r"^blocked$", "Blocked"), (r"^cut$", "Cut"),
    ]
    for pat, out in table:
        if re.match(pat, v, re.I):
            return out
    return "Unknown"


def extract_link(s):
    m = re.search(r"\(([^)]+)\)", s)
    if m and m.group(1):
        return m.group(1)
    stripped = s.strip("`").strip()
    return stripped or None


# The identifier column name varies by features.md vintage: /feature-map now
# emits `id`; older tables used `slug` or `feature`. The roster table is the one
# that pairs any of these with a `status` column (this excludes sibling tables
# like Deferred, which carry an `id` but no `status`).
_FEATURE_ID_COLUMNS = ("slug", "id", "feature")


def parse_features_table(text):
    out = []
    cols, in_table = [], False
    lines = text.split("\n")
    i = 0
    while i < len(lines):
        line = lines[i]
        header = [c.strip().lower() for c in line.split("|") if c.strip()] if line.startswith("|") else []
        if not in_table and "status" in header and any(c in header for c in _FEATURE_ID_COLUMNS):
            cols = header
            in_table = True
            i += 2  # skip header + separator
            continue
        if not in_table or not line.startswith("|"):
            in_table = False
            i += 1
            continue
        cells = [c.strip() for c in line.split("|")][1:-1]
        if len(cells) < 2 or all(c == "" or re.match(r"^-+$", c) for c in cells):
            i += 1
            continue
        row = {c: (cells[j] if j < len(cells) else "") for j, c in enumerate(cols)}
        slug = next((row[c] for c in _FEATURE_ID_COLUMNS if row.get(c)), "").strip("`")
        if slug:
            out.append({
                "slug": slug,
                "status": normalize_status(row.get("status")),
                "priority": row.get("priority") or "",
                "prdLink": extract_link(row.get("prd") or row.get("prd link") or ""),
            })
        i += 1
    return out


def slice_number(filename):
    m = re.match(r"^SLICE-(\d+)", filename)
    return int(m.group(1)) if m else 0


def collect_backend_refs(fm):
    out = {}
    for k, v in fm.items():
        if k.startswith("backend_refs.") and isinstance(v, str) and v:
            out[k[len("backend_refs."):]] = v
    return out


def read_ticket_status_log(root, feature, slice_num):
    d = os.path.join(root, "tickets", feature)
    if not os.path.exists(d):
        return None
    match = next((f for f in os.listdir(d)
                  if f.startswith(f"SLICE-{slice_num}-") and f.endswith(".md")), None)
    if not match:
        return None
    text = read(os.path.join(d, match))
    if re.search(r"^##\s+Completion\b", text, re.I | re.M):
        m = re.search(r"^##\s+Completion\b[^\n]*\n([^\n]*)", text, re.I | re.M)
        first = m.group(1)[:80].strip() if m and m.group(1) else ""
        return f"## Completion{f' — {first}' if first else ''}"
    start = re.search(r"^##\s+Status log\b", text, re.I | re.M)
    if not start:
        return None
    after = text[start.end():]
    nxt = re.search(r"\n##\s", after)
    body = after[:nxt.start()] if nxt else after
    items = [l.strip() for l in body.split("\n") if l.strip().startswith("- ")]
    return items[-1] if items else None


@lru_cache(maxsize=None)
def closed_backend_ids(root):
    """Bead IDs the beads backend reports as closed — the runtime done-signal a
    slice's frozen frontmatter intentionally never carries (canonical status only
    moves open->published->removed; 'merged' is a backend fact, build/SKILL.md).
    Best-effort: an empty set when the project has no `.beads` store or the `bd`
    CLI is unavailable, so the generator still runs on any project and falls back
    to the file-only view. Cached per root — the run shells out to `bd` once."""
    if not os.path.isdir(os.path.join(root, ".beads")):
        return frozenset()
    try:
        proc = subprocess.run(
            ["bd", "list", "--status=closed", "--json"],
            cwd=root, capture_output=True, text=True, timeout=15,
        )
    except (OSError, subprocess.SubprocessError):
        return frozenset()
    if proc.returncode != 0 or not proc.stdout.strip():
        return frozenset()
    try:
        issues = json.loads(proc.stdout)
    except json.JSONDecodeError:
        return frozenset()
    if not isinstance(issues, list):
        return frozenset()
    return frozenset(i["id"] for i in issues if isinstance(i, dict) and i.get("id"))


def derive_slice_status(raw_status, last_activity, depends_on, merged_ids, is_backend_merged=False):
    if raw_status == "removed":
        return "removed"
    if raw_status == "open":
        return "planned"
    # 'merged' is a runtime fact — a closed backend ticket or a ticket Completion
    # log — never the frozen canonical status, which never says 'merged'.
    if is_backend_merged or (last_activity and re.match(r"^## Completion", last_activity, re.I)):
        return "merged"
    if last_activity:
        return "in-progress"
    if any(d not in merged_ids for d in depends_on):
        return "blocked"
    return "published"


def scan_slices(root, feature):
    d = os.path.join(root, ".ai/specs", feature, "issues")
    if not os.path.exists(d):
        return []
    files = sorted((f for f in os.listdir(d) if re.match(r"^SLICE-\d+", f) and f.endswith(".md")),
                   key=slice_number)
    interim = []
    for f in files:
        text = read(os.path.join(d, f))
        fm = read_frontmatter_text(text)
        snum = as_string(fm.get("slice")) or str(slice_number(f))
        raw_status = as_string(fm.get("status")) or "open"
        last_activity = read_ticket_status_log(root, feature, snum)
        depends = [f"SLICE-{x}" if re.match(r"^\d+$", x) else x for x in as_list(fm.get("depends_on"))]
        info = {
            "id": f"SLICE-{snum}", "feature": feature,
            "title": as_string(fm.get("title")) or f, "status": "published",
            "rawStatus": raw_status, "type": as_string(fm.get("type")) or "?",
            "priority": as_string(fm.get("priority")) or "P2", "dependsOn": depends,
            "backendRefs": collect_backend_refs(fm),
            "satisfiesFIds": as_list(fm.get("satisfies_f_ids")),
            "satisfiesUserStories": as_list(fm.get("satisfies_user_stories")),
            "satisfiesNfrs": as_list(fm.get("satisfies_nfrs")),
            "satisfiesUnwanted": as_list(fm.get("satisfies_unwanted")),
            "file": os.path.relpath(os.path.join(d, f), root), "lastActivity": last_activity,
        }
        interim.append(info)
    # A slice whose backend ticket is closed is merged, even when its frozen
    # frontmatter still reads 'published' (scc-934). Seed merged_ids with those
    # so dependents unblock too; the canonical files are never touched.
    closed = closed_backend_ids(root)
    backend_merged = {x["id"] for x in interim if x["backendRefs"].get("beads") in closed}
    merged_ids = set(x["id"] for x in interim
                     if re.match(r"^## Completion", x["lastActivity"] or "", re.I) or x["rawStatus"] == "merged")
    merged_ids |= backend_merged
    for x in interim:
        x["status"] = derive_slice_status(
            x["rawStatus"], x["lastActivity"], x["dependsOn"], merged_ids,
            is_backend_merged=x["id"] in backend_merged,
        )
        if x["status"] == "merged":
            merged_ids.add(x["id"])
    return interim


def scan_features(root, progress_tail):
    path = os.path.join(root, ".ai", "features.md")
    if not os.path.exists(path):
        return []
    out = []
    for row in parse_features_table(read(path)):
        slug = row["slug"]
        specs = {k: exists(root, f".ai/specs/{slug}/{fn}") for k, fn in [
            ("prd", "prd.md"), ("research", "research.md"), ("design", "design.md"),
            ("plan", "plan.md"), ("qaReport", "qa-report.md"),
            ("asBuilt", "as-built.md"), ("status", "status.md"),
        ]}
        activity = next((e for e in progress_tail if e["scope"] == slug), None)
        out.append({
            "slug": slug, "status": row["status"], "priority": row["priority"],
            "prdLink": row["prdLink"], "specs": specs, "slices": scan_slices(root, slug),
            "lastActivity": activity["skill"] if activity else None,
            "lastActivityDate": activity["date"] if activity else None,
        })
    return out


# ---------------- fitness ----------------

def scan_fitness(root, slugs):
    d = os.path.join(root, "fitness")
    has_codeowners = exists(root, "CODEOWNERS")
    if not os.path.exists(d):
        return {"projectScope": [], "perFeature": {}, "hasCodeowners": has_codeowners}
    project_scope, per_feature = [], {}
    code_ext = re.compile(r"\.(ts|py|java|cs|go)$")
    for entry in os.listdir(d):
        p = os.path.join(d, entry)
        if is_dir(p):
            if entry in slugs:
                per_feature[entry] = [os.path.relpath(x, root) for x in walk_files(p) if code_ext.search(x)]
        elif code_ext.search(entry):
            project_scope.append(os.path.relpath(p, root))
    return {"projectScope": project_scope, "perFeature": per_feature, "hasCodeowners": has_codeowners}


# ---------------- progress tracker ----------------

def read_progress_tracker(root, n):
    path = os.path.join(root, ".ai/progress-tracker.md")
    if not os.path.exists(path):
        return []
    text = read(path)
    re_entry = re.compile(r"^##\s+(\d{4}-\d{2}-\d{2})\s+[—-]+\s+([\w-]+)\s+landed\s+\(([^)]+)\)", re.M)
    out = [{"date": m.group(1), "skill": m.group(2), "scope": m.group(3)} for m in re_entry.finditer(text)]
    return out[:n]  # append-on-top: newest first


# ---------------- next actions ----------------

def compute_next_actions(foundation, features, fitness):
    out = []
    if not foundation["anchor"]["present"]:
        out.append("/anchor — lock stack + tier")
    else:
        if not foundation["featureMap"]["present"]:
            out.append("/feature-map — decompose into prioritized features")
        if not foundation["architect"]["present"]:
            out.append("/architect — produce HLD")
        elif (foundation["anchor"]["projectType"] == "greenfield"
              and foundation["architect"]["present"] and not foundation["bootstrap"]["complete"]):
            out.append("/bootstrap — finish the skeleton checklist" if foundation["bootstrap"]["present"]
                       else "/bootstrap — scaffold the project skeleton")
        elif foundation["anchor"]["projectType"] == "brownfield" and not foundation["explore"]["present"]:
            out.append("/explore — recon the existing codebase")

    for f in features:
        if f["status"] == "Planned":
            if not f["specs"]["prd"]:
                out.append(f"/prd {f['slug']}")
            elif not f["specs"]["design"]:
                out.append(f"/design {f['slug']}")
            elif not f["specs"]["plan"]:
                out.append(f"/plan {f['slug']}")
            else:
                out.append(f"/to-issues {f['slug']}")
        elif f["status"] == "Building":
            non_removed = [s for s in f["slices"] if s["status"] != "removed"]
            all_merged = len(non_removed) > 0 and all(s["status"] == "merged" for s in non_removed)
            in_progress = next((s for s in non_removed if s["status"] == "in-progress"), None)
            if all_merged:
                out.append(f"/qa {f['slug']}")
            elif in_progress:
                ref = in_progress["backendRefs"].get("beads") or in_progress["backendRefs"].get("jira") or f"<{in_progress['id']}>"
                out.append(f"/mtdd-verify {ref}  (slice {in_progress['id']} in {f['slug']})")
            elif len(non_removed) == 0:
                out.append(f"/to-issues {f['slug']}  (Building but no slices)")
            else:
                out.append(f"/build {f['slug']}  (pick next slice)")
        elif f["status"] == "QA-Approved":
            out.append(f"/ship {f['slug']}")

    if foundation["anchor"]["tier"] == "production" and len(fitness["projectScope"]) == 0:
        out.append("/to-fitness — generate executable architecture invariants")

    seen, deduped = set(), []
    for a in out:
        if a not in seen:
            seen.add(a)
            deduped.append(a)
    return deduped[:12]


# ---------------- git ----------------

def git(root, args):
    try:
        return subprocess.run(["git", *args], cwd=root, capture_output=True, text=True).stdout
    except Exception:
        return ""


def list_recent_commits(root, n):
    out = git(root, ["log", f"-{n}", "--pretty=format:%h%x09%ad%x09%s", "--date=short"])
    commits = []
    for line in out.split("\n"):
        if not line:
            continue
        parts = line.split("\t")
        commits.append({"sha": parts[0] if parts else "", "date": parts[1] if len(parts) > 1 else "",
                        "subject": "\t".join(parts[2:])})
    return commits


def head_sha(root):
    return git(root, ["rev-parse", "--short", "HEAD"]).strip() or None


def list_recently_modified(root, n):
    code_ext = re.compile(r"\.(md|ts|tsx|py|java|cs|go)$")
    cands = []
    for sub in (".ai", "fitness", "tickets"):
        d = os.path.join(root, sub)
        if not os.path.exists(d):
            continue
        for p in walk_files(d):
            if not code_ext.search(p):
                continue
            try:
                mt = os.stat(p).st_mtime
            except OSError:
                continue
            cands.append((os.path.relpath(p, root), mt))
    cands.sort(key=lambda c: c[1], reverse=True)
    return [{"path": p, "mtime": datetime.fromtimestamp(mt, timezone.utc).isoformat()} for p, mt in cands[:n]]


def project_name(root):
    anchor = os.path.join(root, ".ai/anchor.md")
    if os.path.exists(anchor):
        fm = read_frontmatter(anchor)
        name = as_string(fm.get("project_name")) or as_string(fm.get("name"))
        if name:
            return name
    return os.path.basename(root.rstrip("/")) or root


# ---------------- documentation drift ----------------

def _change_index(root):
    """Last-change index for drift detection. Returns (dirty, ctimes, last_commit, git_ok).

    dirty:       repo-relative paths with uncommitted working-tree changes — treated
                 as the newest possible version (catches drift before it is committed).
    ctimes:      repo-relative path -> unix time of the most recent commit touching it.
    last_commit: repo-relative path -> hash of the most recent commit touching it
                 (used to read a downstream doc's upstream baseline via `git show`).
    git_ok:      False when ROOT is not a git work tree, so callers skip the freshness
                 comparison (fail-open) instead of emitting false staleness.

    Commit time is used rather than filesystem mtime because a `git checkout`
    rewrites mtimes and would scramble the source-vs-mirror ordering.
    """
    if git(root, ["rev-parse", "--is-inside-work-tree"]).strip() != "true":
        return set(), {}, {}, False
    dirty = set()
    for line in git(root, ["status", "--porcelain"]).split("\n"):
        if len(line) <= 3:
            continue
        path = line[3:].strip().strip('"')
        if " -> " in path:  # rename: the destination is what now exists
            path = path.split(" -> ", 1)[1]
        dirty.add(path)
    ctimes, last_commit = {}, {}
    cur_h = cur_t = None
    for line in git(root, ["log", "--format=%H|%ct", "--name-only", "--", ".ai", ".human"]).split("\n"):
        line = line.strip()
        if not line:
            continue
        m = re.match(r"^([0-9a-f]{7,40})\|(\d+)$", line)
        if m:
            cur_h, cur_t = m.group(1), int(m.group(2))
        elif cur_t is not None and line not in ctimes:
            ctimes[line] = cur_t  # first occurrence (newest-first walk) = latest commit
            last_commit[line] = cur_h
    return dirty, ctimes, last_commit, True


def _change_key(rel, dirty, ctimes):
    """Comparable last-change time; None when unknown (caller skips comparison)."""
    if rel in dirty:
        return float("inf")
    return ctimes.get(rel)


def _mirror_fix_hint(source_rel):
    """The skill whose update mode regenerates the .human mirror for SOURCE_REL."""
    m = re.match(r"\.ai/specs/[^/]+/(prd|design|qa-report)\.md$", source_rel)
    if m:
        feature = source_rel.split("/")[2]
        skill = {"prd": "prd", "design": "design", "qa-report": "qa"}[m.group(1)]
        return f"/{skill} {feature} (update mode regenerates the mirror)"
    root_doc = {
        ".ai/anchor.md": "/anchor",
        ".ai/features.md": "/feature-map",
        ".ai/architecture/index.md": "/architect",
        ".ai/context.md": "/understand",
    }.get(source_rel)
    if not root_doc and source_rel.startswith(".ai/understanding/"):
        root_doc = "/understand"
    if root_doc:
        return f"{root_doc} (update mode regenerates the mirror)"
    return "re-run the producing skill in update mode to regenerate the mirror"


_SOURCE_FIELDS = (
    "source", "source_prd", "source_design", "source_plan", "source_anchor",
    "source_recon", "source_discovery", "source_understanding", "source_features",
    "source_architecture", "source_context", "source_intake", "source_outcome",
    "source_data_management", "source_test_strategy", "source_asbuilt",
)


def _git_show(root, ref):
    """(content, ok) for `git show REF`; ok=False on any error."""
    try:
        p = subprocess.run(["git", "show", ref], cwd=root, capture_output=True, text=True)
        return p.stdout, p.returncode == 0
    except Exception:
        return "", False


def _premise_fix_hint(target_rel):
    """How to refresh the stale downstream doc TARGET_REL."""
    m = re.match(r"\.ai/specs/([^/]+)/(prd|design|plan|qa-report)\.md$", target_rel)
    if m:
        feature, stage = m.group(1), m.group(2)
        skill = {"prd": "prd", "design": "design", "plan": "plan", "qa-report": "qa"}[stage]
        return f"review/regenerate via /{skill} {feature} (update mode)"
    m = re.match(r"\.ai/specs/([^/]+)/issues/SLICE-\d+", target_rel)
    if m:
        return f"re-slice via /to-issues {m.group(1)} (update mode)"
    return "review the downstream doc against its changed upstream"


def _premise_for(root, d_rel, fm, dirty, ctimes, last_commit):
    """premise-drift findings for one downstream doc D_REL with frontmatter FM.

    An upstream U declared as a source of D is flagged when U is newer than the
    commit that last generated D (the timestamp prune) AND U's content as of that
    commit differs from U's content now (the content confirm — beats a
    change-then-revert false positive). D mid-edit (dirty) or untracked is skipped:
    its baseline is moot.
    """
    if d_rel in dirty:
        return []
    d_commit = last_commit.get(d_rel)
    d_time = ctimes.get(d_rel)
    if not d_commit or d_time is None:
        return []
    out = []
    seen = set()
    upstreams = [as_string(fm.get(f)) for f in _SOURCE_FIELDS]
    upstreams += as_list(fm.get("sources"))
    for u_rel in upstreams:
        u_rel = (u_rel or "").strip()
        if not u_rel or u_rel == d_rel or u_rel in seen:
            continue
        seen.add(u_rel)
        if not os.path.isfile(os.path.join(root, u_rel)):
            continue
        u_time = float("inf") if u_rel in dirty else ctimes.get(u_rel)
        if u_time is None or u_time <= d_time:
            continue
        baseline, ok = _git_show(root, f"{d_commit}:{u_rel}")
        if not ok:
            continue
        if read(os.path.join(root, u_rel)) != baseline:
            out.append({
                "kind": "premise-drift", "severity": "warn",
                "source": u_rel, "target": d_rel,
                "detail": f"{u_rel} changed after {d_rel} was last generated — {d_rel} may rest on stale premises",
                "fix": _premise_fix_hint(d_rel),
            })
    return out


def _read_coherence_report(root):
    """Fold in spec-coherence findings from an optional dashboard/coherence.json.

    Written by /coherence-check (its machine-readable producer is a follow-up
    slice). Absent or malformed -> no entries (fail-open).
    """
    path = os.path.join(root, "dashboard", "coherence.json")
    if not os.path.exists(path):
        return []
    try:
        data = json.loads(read(path))
        findings = data.get("findings", []) if isinstance(data, dict) else []
    except Exception:
        return []
    out = []
    for f in findings:
        if not isinstance(f, dict):
            continue
        out.append({
            "kind": "spec-drift",
            "severity": as_string(f.get("severity")) or "warn",
            "source": as_string(f.get("source")),
            "target": as_string(f.get("target")) or None,
            "detail": as_string(f.get("detail")) or "coherence contradiction",
            "fix": as_string(f.get("fix")) or "/coherence-check",
        })
    return out


def compute_drift(root):
    """Documentation-drift signals between linked docs (read-only, billing-free).

    Two mechanical classes, plus a fold-in:
      - missing-mirror: a `.ai` doc declares a `.human` projection that is absent.
      - stale-mirror:   the `.ai` source changed after its mirror was last built.
    Mirror links are read from `human_summary`/`human_runbook` frontmatter on the
    `.ai` side (the only machine-resolvable edge — `.human` files carry no
    frontmatter). Spec-vs-spec drift is semantic and arrives via the coherence
    report, not a timestamp heuristic: downstream being newer than its upstream is
    the normal, healthy state, so timestamps alone would false-fire.
    """
    out = []
    dirty, ctimes, last_commit, git_ok = _change_index(root)
    ai_dir = os.path.join(root, ".ai")
    if os.path.exists(ai_dir):
        for p in sorted(walk_files(ai_dir)):
            if not p.endswith(".md"):
                continue
            fm = read_frontmatter(p)
            source_rel = os.path.relpath(p, root)
            for field in ("human_summary", "human_runbook"):
                mirror_rel = as_string(fm.get(field))
                if not mirror_rel:
                    continue
                if not os.path.exists(os.path.join(root, mirror_rel)):
                    out.append({
                        "kind": "missing-mirror", "severity": "error",
                        "source": source_rel, "target": mirror_rel,
                        "detail": f"{source_rel} declares a human mirror that does not exist",
                        "fix": _mirror_fix_hint(source_rel),
                    })
                    continue
                if not git_ok:
                    continue
                st = _change_key(source_rel, dirty, ctimes)
                mt = _change_key(mirror_rel, dirty, ctimes)
                if st is not None and mt is not None and st > mt:
                    out.append({
                        "kind": "stale-mirror", "severity": "warn",
                        "source": source_rel, "target": mirror_rel,
                        "detail": f"{source_rel} changed after its mirror was last generated",
                        "fix": _mirror_fix_hint(source_rel),
                    })
            if git_ok:
                out.extend(_premise_for(root, source_rel, fm, dirty, ctimes, last_commit))
    out.extend(_read_coherence_report(root))
    return out


# ---------------- top-level scan ----------------

def scan_project(root):
    foundation = scan_foundation(root)
    progress_tail = read_progress_tracker(root, 20)
    features = scan_features(root, progress_tail)
    fitness = scan_fitness(root, [f["slug"] for f in features])
    return {
        "root": root,
        "projectName": project_name(root),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "generatedAtSha": head_sha(root),
        "foundation": foundation,
        "features": features,
        "fitness": fitness,
        "progressTail": progress_tail,
        "recentCommits": list_recent_commits(root, 20),
        "recentlyModified": list_recently_modified(root, 20),
        "nextActions": compute_next_actions(foundation, features, fitness),
        "drift": compute_drift(root),
    }


# ---------------- HTML render (the /status --html lens) ----------------

def esc(s):
    return (str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;").replace("'", "&#39;"))


def fmt_time(iso):
    return re.sub(r"\..*", "", iso.replace("T", " "))


CSS = """
:root { --bg:#0b0d10; --fg:#e6e8ec; --muted:#8b95a3; --border:#1c2230; --surface:#11151c; --ok:#22c55e; --warn:#f59e0b; --err:#ef4444; --done:#22c55e; --in-progress:#f59e0b; --pending:#6b7280; --skipped:#475569; --accent:#60a5fa; }
* { box-sizing: border-box; }
body { margin:0; background: var(--bg); color: var(--fg); font: 14px/1.45 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
.hdr { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; padding:24px; border-bottom: 1px solid var(--border); }
.hdr h1 { margin:0 0 4px; font-size:22px; }
.hdr p { margin:0; }
.hdr .meta { font-size:12px; }
.muted { color: var(--muted); }
.tabs { display:flex; gap:4px; padding: 12px 24px 0; border-bottom: 1px solid var(--border); }
.tab { background: transparent; color: var(--muted); border: 1px solid transparent; border-bottom: none; padding: 8px 12px; cursor:pointer; border-radius: 6px 6px 0 0; }
.tab.active { color: var(--fg); border-color: var(--border); background: var(--surface); }
main { padding: 24px; }
.pane { display:none; }
.pane.active { display:block; }
.grid { display:grid; grid-template-columns: 1fr 1fr; gap:16px; }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 16px; }
.card.span-2 { grid-column: 1 / -1; }
.card h2 { margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
.card h3 { margin: 12px 0 4px; font-size: 12px; }
ul.kv { list-style: none; margin:0; padding:0; display:grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; }
ul.kv li { display:flex; justify-content: space-between; }
ol.next { margin: 0 0 8px; padding-left: 20px; }
ol.next li { padding: 2px 0; }
table.t { width:100%; border-collapse: collapse; }
table.t th, table.t td { text-align:left; padding: 8px 10px; border-bottom: 1px solid var(--border); vertical-align: top; font-size: 13px; }
table.t th { color: var(--muted); font-weight: 500; text-transform: uppercase; font-size: 11px; letter-spacing: 0.06em; }
.badge { padding: 2px 8px; border-radius: 999px; font-size: 11px; }
.badge.done { background: rgba(34,197,94,0.15); color: var(--done); }
.badge.in-progress { background: rgba(245,158,11,0.15); color: var(--in-progress); }
.badge.pending { background: rgba(107,114,128,0.15); color: var(--muted); }
.badge.skipped { background: rgba(71,85,105,0.18); color: var(--muted); }
.badge.warn { background: rgba(239,68,68,0.15); color: var(--err); }
.ok { color: var(--ok); }
.miss { color: var(--muted); }
.board { display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 12px; }
.col { background: var(--surface); border:1px solid var(--border); border-radius: 8px; padding: 10px; }
.col h3 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; color: var(--muted); letter-spacing: 0.06em; }
.slice { background: var(--bg); border:1px solid var(--border); border-radius: 6px; padding: 8px 10px; margin-bottom: 6px; }
.slice header { display:flex; justify-content: space-between; gap: 6px; margin-bottom: 4px; }
.slice p { margin: 0; font-size: 12px; }
.commits { list-style: none; margin:0; padding:0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; }
.commits li { padding: 3px 0; border-bottom: 1px dashed var(--border); }
.sha { color: var(--accent); }
.ftr { padding: 16px 24px; color: var(--muted); font-size: 12px; border-top: 1px solid var(--border); }
code { background: var(--surface); padding: 1px 6px; border-radius: 4px; font-size: 12px; }
@media (max-width: 720px) { .grid { grid-template-columns: 1fr; } .hdr { flex-direction: column; align-items: flex-start; } }
"""

JS = """
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b === btn));
    document.querySelectorAll('.pane').forEach(p => p.classList.toggle('active', p.dataset.pane === id));
  });
});
"""


def status_class(status):
    return {"Shipped": "done", "QA-Approved": "done", "Building": "in-progress",
            "Planned": "pending", "Blocked": "warn"}.get(status, "skipped")


def cell(b):
    return '<span class="ok">✓</span>' if b else '<span class="miss">·</span>'


def foundation_row(label, present, optional=False):
    c = '<span class="ok">✓</span>' if present else ('<span class="muted">opt</span>' if optional else '<span class="miss">·</span>')
    return f'<li><span>{esc(label)}</span><b>{c}</b></li>'


def foundation_step(num, label, ok, path, optional=False):
    badge = ('<span class="badge done">present</span>' if ok
             else ('<span class="badge skipped">optional</span>' if optional else '<span class="badge pending">missing</span>'))
    return f'<tr><td>{esc(num)}</td><td><b>{esc(label)}</b></td><td>{badge}</td><td><code>{esc(path)}</code></td></tr>'


def render_overview(s):
    fe = s["features"]
    counts = {
        "features": len(fe),
        "building": sum(1 for f in fe if f["status"] == "Building"),
        "qa": sum(1 for f in fe if f["status"] == "QA-Approved"),
        "shipped": sum(1 for f in fe if f["status"] == "Shipped"),
        "slices": sum(len(f["slices"]) for f in fe),
        "merged": sum(sum(1 for sl in f["slices"] if sl["status"] == "merged") for f in fe),
        "inprog": sum(sum(1 for sl in f["slices"] if sl["status"] == "in-progress") for f in fe),
    }
    fo = s["foundation"]
    nxt = s["nextActions"][:8]
    next_html = ('<p class="muted">All foundation artifacts present, every feature has its next-skill output. Pick a feature from the Features tab.</p>'
                 if not nxt else '<ol class="next">' + "".join(f'<li><code>{esc(n)}</code></li>' for n in nxt) + '</ol>')
    brown = fo["anchor"]["projectType"] == "brownfield"
    return f"""
<div class="grid">
  <div class="card"><h2>Counts</h2><ul class="kv">
    <li><span>Features</span><b>{counts['features']}</b></li>
    <li><span>Building</span><b>{counts['building']}</b></li>
    <li><span>QA-Approved</span><b>{counts['qa']}</b></li>
    <li><span>Shipped</span><b>{counts['shipped']}</b></li>
    <li><span>Slices total</span><b>{counts['slices']}</b></li>
    <li><span>Slices merged</span><b>{counts['merged']}</b></li>
    <li><span>Slices in progress</span><b>{counts['inprog']}</b></li>
  </ul></div>
  <div class="card"><h2>Foundation</h2><ul class="kv">
    {foundation_row("Anchor", fo['anchor']['present'])}
    {foundation_row("Features map", fo['featureMap']['present'])}
    {foundation_row("Architecture", fo['architect']['present'])}
    {foundation_row("Strategic design (DDD)", fo['dddStrategy']['present'], True)}
    {foundation_row("Domain model (event-storm)", fo['eventStorm']['present'], True)}
    {foundation_row("Recon" if brown else "Bootstrap", fo['explore']['present'] if brown else fo['bootstrap']['complete'], True)}
  </ul></div>
  <div class="card span-2"><h2>Next actions</h2>{next_html}
    <p class="muted">Forward decision → <code>/next</code> · backward recap → <code>/next --resume</code></p>
  </div>
</div>"""


def render_foundation(s):
    f = s["foundation"]
    rows = [
        foundation_step("0", "/discovery", f["discover"]["present"], (f["discover"]["files"] or [".ai/discovery/"])[0]),
        foundation_step("0+", "/understand", f["understand"]["present"], (f["understand"]["files"] or [".ai/understanding/"])[0]),
        foundation_step("0++", "/event-storm (optional)", f["eventStorm"]["present"], ".ai/architecture/domain-model.md", True),
        foundation_step("1", "/feature-map", f["featureMap"]["present"], ".ai/features.md"),
        foundation_step("2", "/anchor", f["anchor"]["present"], ".ai/anchor.md"),
        foundation_step("2+", "/ddd-strategy (optional)", f["dddStrategy"]["present"], ".ai/architecture/strategic-design.md", True),
        foundation_step("3", "/architect", f["architect"]["present"], ".ai/architecture/" if f["architect"]["bundled"] else ".ai/architecture.md"),
    ]
    if f["anchor"]["projectType"] == "brownfield":
        rows.append(foundation_step("3+", "/explore (brownfield)", f["explore"]["present"], ".ai/recon.md", True))
    else:
        bp = ".ai/bootstrap.md (in-progress)" if (f["bootstrap"]["present"] and not f["bootstrap"]["complete"]) else ".ai/bootstrap.md"
        rows.append(foundation_step("3+", "/bootstrap (greenfield)", f["bootstrap"]["complete"], bp, True))
    return (f'<table class="t"><thead><tr><th>Step</th><th>Skill</th><th>Status</th><th>Path</th></tr></thead>'
            f'<tbody>{"".join(rows)}</tbody></table>'
            f'<p class="muted">Foundation runs once per project. Tier: <b>{esc(f["anchor"]["tier"])}</b> · Architecture ADRs: <b>{f["architect"]["adrCount"]}</b>.</p>')


def render_features(s):
    if not s["features"]:
        return '<p class="muted">No features in <code>.ai/features.md</code> yet — run <code>/feature-map</code>.</p>'
    rows = []
    for f in s["features"]:
        merged = sum(1 for sl in f["slices"] if sl["status"] == "merged")
        total = sum(1 for sl in f["slices"] if sl["status"] != "removed")
        activity = (f'{esc(f["lastActivityDate"])} <span class="muted">{esc(f["lastActivity"] or "")}</span>'
                    if f["lastActivityDate"] else '<span class="muted">—</span>')
        rows.append(f'<tr><td><b>{esc(f["slug"])}</b></td>'
                    f'<td><span class="badge {status_class(f["status"])}">{esc(f["status"])}</span></td>'
                    f'<td>{esc(f["priority"])}</td><td>{cell(f["specs"]["prd"])}</td><td>{cell(f["specs"]["research"])}</td>'
                    f'<td>{cell(f["specs"]["design"])}</td><td>{cell(f["specs"]["plan"])}</td><td>{cell(f["specs"]["qaReport"])}</td>'
                    f'<td>{merged}/{total}</td><td>{activity}</td></tr>')
    return ('<table class="t"><thead><tr><th>Slug</th><th>Status</th><th>Priority</th><th>PRD</th><th>Research</th>'
            '<th>Design</th><th>Plan</th><th>QA</th><th>Slices</th><th>Last activity</th></tr></thead>'
            f'<tbody>{"".join(rows)}</tbody></table>')


def render_slices(s):
    allslices = [sl for f in s["features"] for sl in f["slices"]]
    if not allslices:
        return '<p class="muted">No slices yet — run <code>/to-issues &lt;feature&gt;</code> for a planned feature.</p>'
    states = ["planned", "published", "blocked", "in-progress", "merged", "removed"]
    buckets = {st: [sl for sl in allslices if sl["status"] == st] for st in states}
    cols = []
    for c in states:
        cards = []
        for sl in buckets[c][:50]:
            ref = " · ".join(f"{k}: {v}" for k, v in sl["backendRefs"].items())
            cards.append(
                f'<article class="slice"><header><b>{esc(sl["id"])}</b> '
                f'<span class="muted">{esc(sl["feature"])} · {esc(sl["type"])}</span></header><p>{esc(sl["title"])}</p>'
                + (f'<p class="muted">depends on: {", ".join(esc(d) for d in sl["dependsOn"])}</p>' if sl["dependsOn"] else "")
                + (f'<p class="muted">{esc(ref)}</p>' if ref else "")
                + (f'<p class="muted">{esc(sl["lastActivity"])[:100]}</p>' if sl["lastActivity"] else "")
                + '</article>')
        more = f'<p class="muted">+{len(buckets[c]) - 50} more</p>' if len(buckets[c]) > 50 else ""
        cols.append(f'<div class="col"><h3>{esc(c)}<span class="muted"> · {len(buckets[c])}</span></h3>{"".join(cards)}{more}</div>')
    return f'<div class="board">{"".join(cols)}</div>'


def render_fitness(s):
    f = s["fitness"]
    if not f["projectScope"] and not f["perFeature"]:
        return '<p class="muted">No <code>fitness/</code> rules yet — run <code>/to-fitness</code> at production tier.</p>'
    proj = ('<p class="muted">none</p>' if not f["projectScope"]
            else '<ul class="commits">' + "".join(f'<li>{esc(p)}</li>' for p in f["projectScope"][:50]) + '</ul>')
    perf = ('<p class="muted">none</p>' if not f["perFeature"]
            else "".join(f'<h3 class="muted">{esc(slug)}</h3><ul class="commits">'
                         + "".join(f'<li>{esc(p)}</li>' for p in paths[:50]) + '</ul>'
                         for slug, paths in f["perFeature"].items()))
    co = '<span class="ok">✓</span>' if f["hasCodeowners"] else '<span class="miss">missing — append <code>fitness/ @&lt;team&gt;</code></span>'
    return (f'<div class="grid"><div class="card"><h2>Project scope</h2>{proj}</div>'
            f'<div class="card"><h2>Per feature</h2>{perf}</div>'
            f'<div class="card span-2"><p>CODEOWNERS: {co}</p></div></div>')


def render_activity(s):
    pt = ('<p class="muted">No entries.</p>' if not s["progressTail"]
          else '<ul class="commits">' + "".join(
              f'<li><span class="sha">{esc(e["date"])}</span> {esc(e["skill"])} <span class="muted">({esc(e["scope"])})</span></li>'
              for e in s["progressTail"][:20]) + '</ul>')
    rc = ('<p class="muted">No git history.</p>' if not s["recentCommits"]
          else '<ul class="commits">' + "".join(
              f'<li><span class="sha">{esc(c["sha"])}</span> <span class="muted">{esc(c["date"])}</span> {esc(c["subject"])}</li>'
              for c in s["recentCommits"]) + '</ul>')
    rm = '<ul class="commits">' + "".join(
        f'<li><span class="muted">{esc(fmt_time(m["mtime"]))}</span> {esc(m["path"])}</li>'
        for m in s["recentlyModified"]) + '</ul>'
    return (f'<div class="grid"><div class="card"><h2>Progress tracker</h2>{pt}</div>'
            f'<div class="card"><h2>Recent commits</h2>{rc}</div>'
            f'<div class="card span-2"><h2>Recently modified</h2>{rm}</div></div>')


def render_html(s):
    tier = s["foundation"]["anchor"]["tier"]
    show_fitness = tier == "production"
    c = s["recentCommits"][0] if s["recentCommits"] else None
    head = (f'<span class="sha">{esc(c["sha"])}</span> {esc(c["subject"])} <span class="muted">{esc(c["date"])}</span>'
            if c else '<span class="muted">no git history</span>')
    fit_tab = '<button class="tab" data-tab="fitness">Fitness</button>' if show_fitness else ""
    fit_pane = f'<section data-pane="fitness" class="pane">{render_fitness(s)}</section>' if show_fitness else ""
    sha_html = f' at <span class="sha">{esc(s["generatedAtSha"])}</span>' if s["generatedAtSha"] else ""
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{esc(s['projectName'])} — chain dashboard</title>
<style>{CSS}</style>
</head>
<body>
<header class="hdr">
  <div>
    <h1>{esc(s['projectName'])}</h1>
    <p class="muted">tier: <b>{esc(tier)}</b> · language: {esc(s['foundation']['anchor']['language'])} · type: {esc(s['foundation']['anchor']['projectType'])} · generated {fmt_time(s['generatedAt'])}{sha_html}</p>
  </div>
  <div class="meta">{head}</div>
</header>
<nav class="tabs" role="tablist">
  <button class="tab active" data-tab="overview">Overview</button>
  <button class="tab" data-tab="foundation">Foundation</button>
  <button class="tab" data-tab="features">Features</button>
  <button class="tab" data-tab="slices">Slices</button>
  {fit_tab}
  <button class="tab" data-tab="activity">Activity</button>
</nav>
<main>
  <section data-pane="overview" class="pane active">{render_overview(s)}</section>
  <section data-pane="foundation" class="pane">{render_foundation(s)}</section>
  <section data-pane="features" class="pane">{render_features(s)}</section>
  <section data-pane="slices" class="pane">{render_slices(s)}</section>
  {fit_pane}
  <section data-pane="activity" class="pane">{render_activity(s)}</section>
</main>
<footer class="ftr">
  Refresh: <code>python3 .claude/skills/_build_share/project-state.py --html</code>.
  Read-only — source files are not touched.
</footer>
<script>{JS}</script>
</body>
</html>"""


# ---------------- main ----------------

def main(argv):
    want_html = "--html" in argv
    positional = [a for a in argv if not a.startswith("--")]
    root = os.path.abspath(positional[0]) if positional else os.getcwd()
    out_dir = os.path.join(root, "dashboard")
    os.makedirs(out_dir, exist_ok=True)
    state = scan_project(root)
    with open(os.path.join(out_dir, "state.json"), "w", encoding="utf-8") as f:
        json.dump(state, f, indent=2)
    fe = state["features"]
    slice_total = sum(len(f["slices"]) for f in fe)
    slice_merged = sum(sum(1 for s in f["slices"] if s["status"] == "merged") for f in fe)
    building = sum(1 for f in fe if f["status"] == "Building")
    qa = sum(1 for f in fe if f["status"] == "QA-Approved")
    if want_html:
        with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8") as f:
            f.write(render_html(state))
        lead = "wrote dashboard/state.json + index.html"
    else:
        lead = "wrote dashboard/state.json"
    print(f"{lead} — {len(fe)} features ({building} Building, {qa} QA-Approved), "
          f"{slice_merged}/{slice_total} slices merged, {len(state['nextActions'])} next actions")


if __name__ == "__main__":
    main(sys.argv[1:])
