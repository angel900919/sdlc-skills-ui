# Python Style — Imperatives

Distilled from Google's Python style guide (which extends PEP 8). Write-time rules — apply as you code, check as you review. For deeper detail see [`full/python.md`](full/python.md).

## Golden rules (always)

1. **PEP 8 is the baseline.** Google adds; never subtracts.
2. **Type annotations on every public function and method.** Module-level constants too if exported.
3. **4-space indent.** Never tabs. Never mix.
4. **80-char line limit.** Wrap with parens, not `\`.
5. **Google-style docstrings** on every public module, function, class, method.
6. **f-strings for formatting.** Never `%` or `.format()` in new code.
7. **Comprehensions over `map` / `filter`.** Generator expression when the result is large or single-pass.
8. **Catch specific exceptions.** Bare `except:` is banned; `except Exception:` is the broadest acceptable form.
9. **`is` for `None`, `==` for value equality.** `if x is None:`, never `if x == None:`.
10. **Context managers (`with`) for resources.** Don't hand-roll `try/finally` on files, locks, connections.

## Naming

| Element | Style | Example |
|---|---|---|
| Module / file | snake_case | `user_service.py` |
| Class / exception / type alias | UpperCamelCase | `UserService`, `ParseError` |
| Function / method / variable / parameter | snake_case | `get_user_by_id` |
| Module-level constant | UPPER_SNAKE_CASE | `MAX_RETRIES` |
| Protected (module-internal) | `_leading_underscore` | `_helper` |
| Name-mangled (rare) | `__double_leading` | `__private` |
| Type variable | UpperCamelCase, short | `T`, `UserT` |

- No `l` / `I` / `O` single-letter names (look like `1` / `0`).
- No abbreviations unless universal (`db`, `url`, `id` ok; `usr` not).
- Test names: `test_<what>_<condition>_<expected>`.

## Type system

- **Annotate every public signature** — parameters AND return type.
- **`Optional[T]` or `T | None`** (3.10+ prefers `|`). Don't lie with bare `T` when `None` is reachable.
- **Accept broadly, return precisely.** `Sequence` / `Mapping` / `Iterable` for parameters; concrete `list` / `dict` for returns.
- **`TypedDict` over `dict`** when keys are fixed and known.
- **`dataclass` (or `attrs`, `pydantic`) for value objects.** Don't hand-roll `__init__` / `__repr__` / `__eq__`.
- **No `Any`** unless wrapped by a typed-narrowing function. `cast()` if you must, with a `# why:` comment.
- **`Protocol` for structural typing.** Don't fake interfaces with ABCs unless you need runtime checks.
- **`from __future__ import annotations`** at module top to skip stringified forward refs.

## Functions

- **Keyword-only args after `*`** for boolean flags and rarely-used params: `def f(x, *, force=False):`.
- **No mutable default arguments.** Use `None` and assign inside.
- **Single underscore for unused** — `for _ in range(n):`, `_, ext = os.path.splitext(p)`.
- **Return early.** Don't nest `if` cascades; return failure cases first.
- **One return type per function.** Splittable union returns (`User | str | None`) are usually two functions.
- **Generators (`yield`) for streaming**; lists when callers need length or indexing.
- **Decorators with `@functools.wraps`** so name / docstring survive.

## Classes

- **`@dataclass(frozen=True)` for immutable value objects.**
- **`@classmethod` for alternate constructors** (`User.from_dict(...)`).
- **`@staticmethod` only if no class state is touched** — a module function is usually better.
- **Single underscore for protected attrs.** Double underscore only when you genuinely need name mangling (rare).
- **`@property` for computed attributes.** No `get_foo()` / `set_foo()` in new code.
- **`__slots__` only when profiling shows memory pressure.**
- **`__repr__` for debuggability.** `__str__` only when the human form differs from the dev form.

## Imports

- **Three groups, blank-line separated:** stdlib → third-party → local. Sort alphabetically within each.
- **`import x` for modules; `from x import y` for specific names.** Never `from x import *`.
- **One import per line.** `import os, sys` is banned.
- **Absolute imports** at module boundaries. Relative (`from . import foo`) only inside the same package's internals.
- **No conditional imports** unless guarding an optional dep; document the why.

## Control flow & literals

- **Truthiness for emptiness:** `if items:`, not `if len(items) > 0:`.
- **Identity for `None` / `True` / `False`:** `if x is None:` / `if found is True:` (when you actually mean the singleton).
- **`enumerate()` over `range(len(...))`.**
- **Unpacking over indexing:** `first, *rest = seq`, not `seq[0], seq[1:]`.
- **Walrus (`:=`) sparingly** — only when it removes duplication, not for cleverness.
- **String quotes:** pick one (Google says `"`); be consistent within a file.
- **Raw strings (`r"..."`) for regex and Windows paths.**

## Docstrings

- `"""Triple-double-quotes, always."""` First line is a summary in imperative mood: `"""Fetches user by id."""`.
- **Google sections:** `Args:`, `Returns:`, `Raises:`, `Yields:`, `Example:`.
- **Type info in the signature, not the docstring.** Don't restate `user_id (int)` — the annotation already says it.
- Document **why**, not what. The signature says what.

## Exception handling

- **Catch specific** — `except ValueError:`, not `except Exception:` (and never `except:`).
- **Re-raise with `from`** to preserve the cause: `raise ValueError(...) from e`.
- **Project base exception** — `class MyError(Exception): ...`, then `class ParseError(MyError): ...`. Callers can catch the base.
- **`try` blocks stay small.** Only the code that can raise. Don't wrap the happy path.
- **`finally` for cleanup; `with` for resources.** Don't write a `try/finally` when a context manager exists.

## Banned

- Bare `except:` clauses.
- Mutable default arguments.
- `from x import *` wildcards.
- `global` for shared state — pass it explicitly or wrap in a class.
- `eval` / `exec` on untrusted input.
- Monkey-patching built-ins or third-party modules in production code.
- `lambda` for anything beyond a one-expression callback.
