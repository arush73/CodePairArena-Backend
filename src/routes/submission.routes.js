import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
// router.use(verifyJWT)

import { createSubmission, getSubmisions } from "../controllers/submission.controllers.js"

router.route("/:problemId").post(createSubmission).get(getSubmisions)

export default router
