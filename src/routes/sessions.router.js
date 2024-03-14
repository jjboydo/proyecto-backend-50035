import express from "express"
import usersModel from "../dao/models/user.model.js"
import { createHash, isValidPassword } from "../utils.js"

const router = express.Router()

// ENDPOINTS

router.post("/register", async (req, res) => {
    try {
        let { first_name, last_name, email, age, password } = req.body
        if (!first_name || !last_name || !email || !age || !password) {
            return res.status(400).send({ status: "error", error: "Faltan datos" })
        }
        const findUser = await usersModel.findOne({ email: email })
        if (findUser) {
            return res.status(400).send({ status: "error", error: "El usuario ya existe" })
        }
        const user = await usersModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password)
        })
        // res.send({ status: "success", payload: user })
        res.redirect("/login")
        console.log("Usuario registrado correctamente")
    } catch (error) {
        return res.status(500).send(error)
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(400).send({ status: "error", error: "Missing data" });
    }
    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
        req.session.user = {
            first_name: "Usuario",
            last_name: "Admin",
            email: "adminCoder@coder.com",
            age: 1
        }
        req.session.admin = true
    } else {
        const user = await usersModel.findOne({ email: email })
        console.log(user)
        if (!user) {
            return res.status(401).send({ status: "error", error: 'User not found' })
        }
        if (!isValidPassword(user, password)) {
            return res.status(403).send({ status: "error", error: 'Incorrect Password' })
        }
        delete user.password
        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age
        }
        req.session.admin = false
    }
    res.redirect("/products")
})

export default router