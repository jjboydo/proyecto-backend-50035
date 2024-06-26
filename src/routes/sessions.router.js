import express from "express"
import passport from "passport"
import { current, deleteUser, failLogin, failRegister, githubCallback, login, recoverPassword, recoverTokenPassword, register, updatePassword } from "../controllers/sessionsController.js"
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

router.get('/current', passportCall('jwt'), applyPolicy(["USER", "USER_PREMIUM"]), current)

router.post('/reset-password', recoverPassword)

router.get('/reset-password/:token', recoverTokenPassword)

router.post('/update-password/:token', updatePassword)

router.delete('/deleteuser/:uid', deleteUser)

export default router