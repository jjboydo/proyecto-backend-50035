import config from "../config/config.js"
import UserDTO from "../dao/DTOs/user.dto.js"
import { generateToken } from "../utils.js"
export const register = async (req, res) => {
    req.logger.info('User registered')
    res.send({ status: "success", message: "User registered" })
}

export const failRegister = async (req, res) => {
    req.logger.error('Failed register')
    res.send({ error: "Failed register" })
}

export const login = async (req, res) => {
    const { email, password } = req.body
    let tokenUser
    if (!email || !password) {
        req.logger.error('Missing data')
        return res.status(400).send({ status: "error", error: "Missing data" });
    }
    if (email === config.adminName && password === config.adminPassword) {
        tokenUser = {
            first_name: "Usuario",
            last_name: "Admin",
            email: config.adminName,
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
            cartId: req.user.cart._id,
            role: "user"
        }
        // req.session.admin = false
    }
    const token = generateToken(tokenUser)
    res.cookie(config.cookieToken, token, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ message: "Logged in!" })
    // res.redirect("/products")
}

export const failLogin = async (req, res) => {
    req.logger.error('Failed login')
    res.send({ error: 'Failed login' })
}

export const githubCallback = async (req, res) => {
    const tokenUser = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: "user"
    }
    const token = generateToken(tokenUser)
    req.logger.info(token)
    res.cookie(config.cookieToken, token, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ message: "Logged in!" })
    // res.redirect("/products")
}

export const current = (req, res) => {
    let user = new UserDTO(req.user)
    res.send(user);
}