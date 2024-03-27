import express from "express"
import usersModel from "../dao/models/user.model.js"
import { authorization, createHash, generateToken, isValidPassword, passportCall } from "../utils.js"
import passport from "passport"

const router = express.Router()

// ENDPOINTS

router.post("/register", passport.authenticate("register", { failureRedirect: "failregister" }), async (req, res) => {
    res.send({ status: "success", message: "usuario registrado" })
})

router.get('/failregister', async (req, res) => {
    console.log('Registro fallido')
    res.send({ error: "Failed register" })
})

router.post("/login", passport.authenticate("login", { failureRedirect: "faillogin" }), async (req, res) => {
    const { email, password } = req.body
    let tokenUser
    if (!email || !password) {
        return res.status(400).send({ status: "error", error: "Missing data" });
    }
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        tokenUser = {
            first_name: "Usuario",
            last_name: "Admin",
            email: "adminCoder@coder.com",
            age: 1,
            role: "admin"
        }
        // req.session.admin = true
    } else {
        tokenUser = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: "user"
        }
        // req.session.admin = false
    }
    const token = generateToken(tokenUser)
    res.cookie("cookieToken", token, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ message: "Logged in!" })
    // res.redirect("/products")
})

router.get('/faillogin', (req, res) => {
    res.send({ error: 'Failed login' })
})

router.get('/github', passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => { })

router.get('/githubcallback', passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    const tokenUser = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: "user"
    }
    const token = generateToken(tokenUser)
    console.log(token)
    res.cookie("cookieToken", token, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ message: "Logged in!" })
    // res.redirect("/products")
})

router.get('/current', passportCall('jwt'), authorization("user"), (req, res) => {
    res.send(req.user);
})

export default router