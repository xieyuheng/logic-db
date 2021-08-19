import Logic, { v, and, or, eq, ty } from ".."
import * as ut from "../ut"

Logic.assertFindResults(
  (v) => [
    and(
      eq(v`x`, v`y`),
      eq(v`y`, v`z`),
      or(eq(v`z`, "a"), eq(v`z`, "b"), eq(v`z`, "c"))
    ),
  ],
  { x: ty.string(), y: ty.string(), z: ty.string() },
  [
    { x: "a", y: "a", z: "a" },
    { x: "b", y: "b", z: "b" },
    { x: "c", y: "c", z: "c" },
  ]
)
