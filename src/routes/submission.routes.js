import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()
router.use(verifyJWT)

import {
  createSubmission,
  getSubmisions,
  getMySubmissions,
} from "../controllers/submission.controllers.js"

router.route("/my-submissions").get(getMySubmissions)
router.route("/:problemId").post(createSubmission).get(getSubmisions)

export default router
