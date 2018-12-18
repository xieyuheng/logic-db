let logic = require ("logic-db")

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

pair.assert ({ male: "bertram", female: "lucinda" })
pair.assert_not ({ male: "apollo", female: "daphne" })

pair.query_log (10) ({ male: "percival", female: "?female" })
pair.query_log (10) ({ male: "camilla", female: "?female" })
pair.query_log (10) ({ male: "?male", female: "lucinda" })
pair.query_log (10) ({ male: "?x", female: "?x" })
pair.query_log (10) ({ male: "?male", female: "fido" })
pair.query_log (10) ({ male: "?male", female: "?female" })
