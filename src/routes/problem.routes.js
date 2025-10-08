import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
// router.use(verifyJWT)

import {
  updateProblem,
  getProblemById,
  addProblem
} from "../controllers/problem.controllers.js"

router.route("/").post(addProblem)
router.route("/:problemId").get(getProblemById)

export default router
