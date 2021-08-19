import assert from "assert"
import Logic, { v, and, or, eq, ty } from ".."
import * as ut from "../ut"

const result = Logic.query(
  (v) => [
    and(
      eq(v`x`, v`y`),
      eq(v`y`, v`z`),
      or(eq(v`z`, "a"), eq(v`z`, "b"), eq(v`z`, "c"))
    ),
  ],
  ["x", "y", "z"],
  { log: true }
)

assert(
  ut.equal(result, [
    { x: "a", y: "a", z: "a" },
    { x: "b", y: "b", z: "b" },
    { x: "c", y: "c", z: "c" },
  ])
)
