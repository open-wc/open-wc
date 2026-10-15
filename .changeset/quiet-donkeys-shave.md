---
"@open-wc/scoped-elements": minor
---

support the final scoped custom element registry spec

`attachShadow` now receives the registry under `customElementRegistry`, the option name settled on by the final spec, on browsers that support scoped registries natively.

The option names are no longer all passed at once. The polyfill replaces the global `CustomElementRegistry` with its own shim and strips `customElements`/`registry` from the init object before delegating to native `attachShadow`, but it does not strip `customElementRegistry`. Passing all three therefore handed a shim to the native implementation, which rejects it — throwing on every `attachShadow` in browsers that ship the feature natively while the polyfill is loaded. The mixin now probes which name the implementation in charge honours and passes only that one.
