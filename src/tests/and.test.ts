import Logic, { v, and, eq, ty } from ".."
import * as ut from "../ut"

Logic.assertFindResults(
  (v) => [and(eq(v`x`, v`y`), eq(v`y`, v`z`), eq(v`z`, "hiya"))],
  { x: ty.string(), y: ty.string(), z: ty.string() },
  [
    {
      x: "hiya",
      y: "hiya",
      z: "hiya",
    },
  ]
)
