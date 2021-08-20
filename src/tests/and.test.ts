import Logic, { v, and, eq, ty } from ".."

Logic.assertFindResults({
  goals: (v) => [and(eq(v`x`, v`y`), eq(v`y`, v`z`), eq(v`z`, "hiya"))],
  projections: {
    x: ty.string(),
    y: ty.string(),
    z: ty.string(),
  },
  results: [
    {
      x: "hiya",
      y: "hiya",
      z: "hiya",
    },
  ],
})
