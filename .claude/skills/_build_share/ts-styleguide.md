# TypeScript Style — Imperatives

Distilled from Google's official TypeScript style guide. Write-time rules — apply as you code, check as you review.

## Golden rules (always)

1. `strict: true` in `tsconfig.json`. Non-negotiable.
2. **Never** `any`. Use `unknown` and narrow.
3. **Never** non-null assertions (`!`). Check explicitly.
4. **Never** `var`. `const` by default, `let` only when reassigned.
5. **Never** default exports. Use named exports.
6. **Never** `namespace`. Use ES modules.
7. Prefer `interface` over `type` alias for object shapes.
8. Mark properties `readonly` when they don't change.
9. Use `import type` for type-only imports.
10. Always use `===` / `!==`. Exception: `== null` to match null+undefined.

## Naming

| Element | Style | Example |
|---|---|---|
| Class / interface / type / enum / decorator | UpperCamelCase | `UserService` |
| Variable / parameter / function / method / property | lowerCamelCase | `getUserById` |
| Module-level constant, enum value, static readonly | CONSTANT_CASE | `MAX_RETRIES` |
| File | lower-kebab-case | `user-service.ts` |
| Test file | `*_test.ts` or `*.test.ts` | per project convention |

- Treat abbreviations as whole words: `loadHttpUrl`, not `loadHTTPURL`.
- No `_private` suffixes/prefixes, no `I` prefix on interfaces, no `opt_` prefix on optional params.
- Don't decorate names with type info — let the type system speak.

## Type system

- **Type inference is fine.** Skip `: boolean = true`; keep annotations on public APIs and complex expressions.
- **Return types** on public/exported functions — clarity now, regression catch later.
- **`unknown` over `any`.** Narrow with `typeof` / `instanceof` / type guards.
- **Optional over `| undefined` in interfaces.** `milk?: Whole | LowFat`, not `milk: Whole | LowFat | undefined`.
- **`T[]` for simple types, `Array<T>` for unions/complex.** `string[]`, `Array<string | number>`.
- **`Map` / `Set` over object-as-dictionary** when keys are dynamic.
- **No wrapper types.** `string`, not `String`; `boolean`, not `new Boolean()`.
- **No type assertions** when an alternative exists. Use runtime checks or annotate the literal directly. If you must assert, comment why.

## Functions

- **Function declarations for named functions.** Arrow functions for callbacks.
- **No function expressions.** `function() {...}` callbacks → arrow.
- **No arrow-function class properties.** Use a method; bind via arrow at the call site.
- **Concise arrow bodies only when the return value is used.** `arr.filter(v => v.ok)` ✓ — `promise.then(v => console.log(v))` ✗ (use block body).
- **No side effects in default parameter values.**
- **Rest params over `arguments`.**

## Classes

- **`private` / `protected` / `public` from TS, never `#private`.**
- **`readonly` for fields that don't change.**
- **Parameter properties** for DI: `constructor(private readonly svc: Service) {}`.
- **Initialize at declaration** when possible: `private readonly users: User[] = [];`
- **No empty constructors** (or constructors that only call `super()`).
- **No `public` modifier** except on non-readonly parameter properties.
- **Getters must be pure** (no side effects). Don't ship pass-through accessors.
- **No private static methods.** Move to module-local functions.

## Imports / exports

- **Named exports only.** No `export default`.
- **No wildcard imports** unless using a large API surface (then namespace import is fine: `import * as fs from 'node:fs'`).
- **`import type` for type-only.** Or inline: `import {type Foo, Bar} from './x'`.
- **No `export let`.** Use a getter function if a value needs to mutate.
- **No "container classes"** with static-only members — use module-level functions and consts.

## Control flow & literals

- **Always braces.** `if (x) { doX(); }` Exception: single-line `if (x) x.doFoo();` (no statement chain).
- **`for...of` over indexed loops.** `for...in` only with `hasOwnProperty` guard (or use `Object.keys` / `Object.entries`).
- **`switch` must have `default`.** No silent fall-through (except empty cases).
- **Single quotes** for ordinary strings. Template literals for interpolation.
- **`String()` / `Boolean()` / `Number()`** for coercion. `Number()` + `isFinite()` for parsing.
- **Throw `new Error(...)`**, never a string. Same for `Promise.reject`.

## JSDoc

- `/** ... */` for documentation; `//` for implementation comments (sparingly).
- Document exported symbols. Skip if name + signature is self-explanatory.
- **Do not write JSDoc type annotations** — TS types are the source of truth.

## Banned

- `eval`, `with`, `Function(...string)` constructor.
- `const enum`. Use plain `enum`.
- `@ts-ignore`, `@ts-nocheck`. `@ts-expect-error` only in tests, sparingly.
- Modifying built-in objects.
- Implicit ASI (always use explicit semicolons).
