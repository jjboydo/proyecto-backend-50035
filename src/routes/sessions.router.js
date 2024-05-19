import express from "express"
import passport from "passport"
import { changeRole, current, failLogin, failRegister, githubCallback, login, register } from "../controllers/sessionsController.js"
import applyPolicy from "../middlewares/auth.middleware.js"
import { passportCall } from "../utils.js"

const router = express.Router()

// ENDPOINTS

router.post("/register", passport.authenticate("register", { failureRedirect: "failregister" }), register)

router.get('/failregister', failRegister)

router.post("/login", passport.authenticate("login", { failureRedirect: "faillogin" }), login)

router.get('/faillogin', failLogin)

router.get('/github', passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate("github", { failureRedirect: "/login" }), githubCallback)

router.get('/current', passportCall('jwt'), applyPolicy(["USER"]), current)

router.put('/premium/:uid', passportCall('jwt'), applyPolicy(["USER", "USER_PREMIUM"]), changeRole)

export default router