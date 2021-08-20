import Logic, { v, eq, ty } from ".."

const pair = new Logic.Table({
  name: "pair",
  schema: ty.tuple(ty.string(), ty.string()),
})

pair.i(["a", "a"])
pair.i(["a", "b"])
pair.i(["a", "c"])
pair.i(["b", "a"])
pair.i(["b", "b"])
pair.i(["b", "c"])
pair.i(["c", "a"])
pair.i(["c", "b"])
pair.i(["c", "c"])

pair.assertFindResults({
  data: [v`x`, v`x`],
  projections: {
    x: ty.string(),
  },
  results: [{ x: "a" }, { x: "b" }, { x: "c" }],
})

const eq_pair = new Logic.Table({
  name: "eq_pair",
  schema: ty.tuple(ty.string(), ty.string()),
})

eq_pair.i([v`x`, v`y`], (v) => [pair.o([v`x`, v`y`]), eq(v`x`, v`y`)])

eq_pair.assertFindResults({
  data: [v`x`, v`y`],
  projections: {
    x: ty.string(),
    y: ty.string(),
  },
  results: [
    { x: "a", y: "a" },
    { x: "b", y: "b" },
    { x: "c", y: "c" },
  ],
})
