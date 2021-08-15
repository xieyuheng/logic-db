import { Table, p } from "../.."
import ty from "@xieyuheng/ty"

const male = new Table({
  name: "male",
  schema: ty.string(),
})

male.i("bertram")
male.i("percival")

const female = new Table({
  name: "female",
  schema: ty.string(),
})

female.i("lucinda")
female.i("camilla")

const pair = new Table({
  name: "pair",
  schema: ty.object({
    male: ty.string(),
    female: ty.string(),
  }),
})

pair.i({ male: p`male`, female: p`female` }, (v) => [
  // male.o(v`male`),
  // female.o(v`female`),
  male.o(`TODO`),
  female.o(`TODO`),
])

// pair.assert({ male: "bertram", female: "lucinda" })
// pair.assert_not({ male: "apollo", female: "daphne" })

// pair.query_log(10)({ male: "percival", female: "?female" })
// pair.query_log(10)({ male: "camilla", female: "?female" })
// pair.query_log(10)({ male: "?male", female: "lucinda" })
// pair.query_log(10)({ male: "?x", female: "?x" })
// pair.query_log(10)({ male: "?male", female: "fido" })
// pair.query_log(10)({ male: "?male", female: "?female" })
