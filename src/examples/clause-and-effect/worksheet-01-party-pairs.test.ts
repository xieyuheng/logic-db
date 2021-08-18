import { Table, v, ty } from "../.."

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

pair.i({ male: v`male`, female: v`female` }, (v) => [
  male.o(v`male`),
  female.o(v`female`),
])

pair.assert({ male: "bertram", female: "lucinda" })
pair.assert({ male: "bertram", female: "lucinda" })
pair.assertNot({ male: "apollo", female: "daphne" })

pair.query({ male: "percival", female: v`female` }, { log: true })
pair.query({ male: "camilla", female: v`female` }, { log: true })
pair.query({ male: v`male`, female: "lucinda" }, { log: true })
pair.query({ male: v`x`, female: v`x` }, { log: true })
pair.query({ male: v`male`, female: "fido" }, { log: true })
pair.query({ male: v`male`, female: v`female` }, { log: true })
