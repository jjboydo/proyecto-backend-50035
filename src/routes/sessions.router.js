import express from "express"
import usersModel from "../dao/models/user.model.js"

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
            password
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
        return res.status(400).send({ status: "error", error: "Faltan datos" });
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
        const userValidated = await usersModel.findOne({ email: email, password: password })
        console.log(userValidated)
        if (!userValidated) {
            return res.status(401).send('Login failed')
        }
        req.session.user = {
            first_name: userValidated.first_name,
            last_name: userValidated.last_name,
            email: userValidated.email,
            age: userValidated.age
        }
        req.session.admin = false
    }
    res.redirect("/products")
})

export default router