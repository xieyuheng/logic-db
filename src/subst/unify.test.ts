import assert from "assert"
import { p } from "../api"
import { Value } from "../value"
import { Subst } from "../subst"

{
  const x = p`x`
  const subst = Subst.create().unify(123, x)
  assert(subst)
  subst.assertFound(x, 123)
}

{
  const x = p`x`
  const subst = Subst.create().unify({ name: "xieyuheng" }, x)
  assert(subst)
  subst.assertFound(x, { name: "xieyuheng" })
}

{
  const x = p`x`
  const subst = Subst.create().unify({ name: "xieyuheng" }, { name: x })
  assert(subst)
  subst.assertFound(x, "xieyuheng")
}

{
  const x = p`x`
  const y = p`y`
  const subst = Subst.create().unify(
    { name: "xieyuheng", items: ["a", "b", "c"] },
    { name: x, items: ["a", y, "c"] }
  )
  assert(subst)
  subst.assertFound(x, "xieyuheng")
  subst.assertFound(y, "b")
}
