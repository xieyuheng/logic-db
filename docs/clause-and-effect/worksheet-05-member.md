---
tangle: worksheet-05-member.js
---

# Member

``` js
let logic = require ("logic-db")

// prepare the lispy list

function cons (x, y) { return { car: x, cdr: y } }

let member = new logic.db_t

member.i ({
    element: "?element",
    list: { car: "?element", cdr: "?cdr" }
})

member.i ({
    element: "?element",
    list: { car: "?car", cdr: "?cdr" },
}) .cond ((the) => member.o ({
    element: the.var.element,
    list: the.var.cdr,
}))

member.assert ({
    element: "john",
    list: cons ("paul", cons ("john", null)),
})

member.assert_not ({
    element: "joe",
    list: cons ("marx", cons ("darwin", cons ("freud", null))),
})

member.query_log (10) ({
    element: "?element",
    list: cons ("paul", cons ("john", null)),
})

member.query_log (6) ({
    element: "foo",
    list: "?list",
})
```
