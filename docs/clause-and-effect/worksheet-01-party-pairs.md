---
tangle: worksheet-01-party-pairs.js
---

# Party pairs

``` js
let logic = require ("../..")

let male = new logic.db_t

male.i ("bertram")
male.i ("percival")

let female = new logic.db_t

female.i ("lucinda")
female.i ("camilla")

let pair = new logic.db_t

pair.i ({
    male: "?male",
    female: "?female",
}) .cond ((the) => {
    return male.o (the.male)
        .and (female.o (the.female))
})

pair.q (10) ({ male: "percival", female: "?female" }) .log ()
pair.q (10) ({ male: "apollo", female: "daphne" })    .log ()
pair.q (10) ({ male: "bertram", female: "lucinda" })  .log ()
pair.q (10) ({ male: "camilla", female: "?female" })  .log ()
pair.q (10) ({ male: "?male", female: "lucinda" })    .log ()
pair.q (10) ({ male: "?x", female: "?x" })            .log ()
pair.q (10) ({ male: "?male", female: "fido" })       .log ()
pair.q (10) ({ male: "?male", female: "?female" })    .log ()
```
