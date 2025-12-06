import { Router } from "express"
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/profile.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/").get(getMyProfile).patch(updateMyProfile)

export default router
