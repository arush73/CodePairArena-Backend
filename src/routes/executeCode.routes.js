import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
// router.use(verifyJWT)

import { executeCode } from "../controllers/codeExecution.controllers.js"

router.route("/").post(executeCode)

export default router
