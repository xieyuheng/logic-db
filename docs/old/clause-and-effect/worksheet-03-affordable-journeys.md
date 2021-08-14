---
tangle: worksheet-03-affordable-journeys.js
---

# Affordable journeys

``` js
let logic = require ("logic-db")

let border = new logic.db_t

border.i (["sussex", "kent"])
border.i (["sussex", "surrey"])
border.i (["surrey", "kent"])
border.i (["hampshire", "sussex"])
border.i (["hampshire", "surrey"])
border.i (["hampshire", "berkshire"])
border.i (["berkshire", "surrey"])
border.i (["wiltshire", "hampshire"])
border.i (["wiltshire", "berkshire"])

// to get symmetry

let adjacent = new logic.db_t

adjacent.i (["?x", "?y"])
    .cond ((the) => border.o ([the.var.x, the.var.y]))
adjacent.i (["?x", "?y"])
    .cond ((the) => border.o ([the.var.y, the.var.x]))

let affordable = new logic.db_t

affordable.i (["?x", "?y"]) .cond ((the) => {
    let z = new logic.var_t
    return adjacent.o ([the.var.x, z])
        .and (adjacent.o ([z, the.var.y]))
})

affordable.query_log (100) (["?to-kent", "kent"])
affordable.query_log (100) (["sussex", "?to-sussex"])
affordable.query_log (100) (["?x", "?y"])
```
