import { Router } from "express"
import { verifyJWT , verifyRole} from "../middlewares/auth.middleware.js"
import {  UserRolesEnum } from "../constants.js"

const router = Router()
// router.use(verifyJWT)

import {
  updateProblem,
  getProblemById,
  addProblem,
  getAllProblems
} from "../controllers/problem.controllers.js"

router.route("/").post(verifyJWT,verifyRole([UserRolesEnum.ADMIN]),addProblem).get(getAllProblems)
router.route("/:problemId").get(getProblemById)

export default router
