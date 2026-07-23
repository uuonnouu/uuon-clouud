---
name: date-fns v3 Vite build fix
description: date-fns v3.6.0 breaks Vite/Rollup production builds because index.mjs is declared but missing
---

## Rule
When the Vite production build fails with:
  `[commonjs--resolver] Failed to resolve entry for package "date-fns"`
it means date-fns v3.x declared `"module": "./index.mjs"` in package.json but that file
does not exist in the installed package.

## Fix
Add a resolve alias in `vite.config.ts` to force the CJS entry:
```ts
resolve: {
  alias: {
    "date-fns": path.resolve(__dirname, "node_modules/date-fns/index.js"),
  }
}
```

**Why:** date-fns v3 dropped the pre-built `index.mjs` in some patch releases but left the
package.json claim intact. Vite v6/Rollup tries the ESM path first and crashes.
The CJS index.js always exists and Rollup's commonjs plugin handles it correctly.

**How to apply:** Only needed if date-fns is a dependency and a production build fails
with the commonjs-resolver message above.
