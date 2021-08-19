import assert from "assert"
import Logic, { v, and, eq, ty } from ".."
import * as ut from "../ut"

const result = Logic.query(
  (v) => [and(eq(v`x`, v`y`), eq(v`y`, v`z`), eq(v`z`, "hiya"))],
  ["x", "y", "z"]
)

assert(
  ut.equal(result, [
    {
      x: "hiya",
      y: "hiya",
      z: "hiya",
    },
  ])
)
