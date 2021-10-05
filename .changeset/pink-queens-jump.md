---
'@open-wc/testing-helpers': patch
'@open-wc/testing': patch
---

Import scoped registries code dynamically to prevent library consumers that do not leverage this API from being bound to its load order requirements.
