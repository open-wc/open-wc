---
"@open-wc/scoped-elements": patch
---

Use `globalThis` instead of `window` to register the scoped elements version, so the package can be imported during SSR
