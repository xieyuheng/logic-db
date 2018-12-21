let logic = require ("logic-db")

let a = new logic.db_t

a.i (["g", "h"])
a.i (["g", "d"])
a.i (["e", "d"])
a.i (["h", "f"])
a.i (["e", "f"])
a.i (["a", "e"])
a.i (["a", "b"])
a.i (["b", "f"])
a.i (["b", "c"])
a.i (["f", "c"])

let path = new logic.db_t

path.i (["?x", "?x"])
path.i (["?x", "?y"]) .cond ((the) => {
    let z = new logic.var_t
    return a.o ([the.var.x, z]) .and (path.o ([z, the.var.y]))
})

path.query_log (100) (["g", "?x"])
path.query_log (100) (["?x", "h"])
