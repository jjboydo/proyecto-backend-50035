import express from "express"
import passport from "passport"
import { current, failLogin, failRegister, githubCallback, login, register } from "../controllers/sessionsController.js"
import { authorization, passportCall } from "../utils.js"

const router = express.Router()

// ENDPOINTS

router.post("/register", passport.authenticate("register", { failureRedirect: "failregister" }), register)

router.get('/failregister', failRegister)

router.post("/login", passport.authenticate("login", { failureRedirect: "faillogin" }), login)

router.get('/faillogin', failLogin)

router.get('/github', passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate("github", { failureRedirect: "/login" }), githubCallback)

router.get('/current', passportCall('jwt'), authorization("user"), current)

export default router