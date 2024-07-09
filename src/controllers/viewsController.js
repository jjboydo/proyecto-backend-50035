import { get } from "mongoose"
import config from "../config/config.js"
import { cartService, productService } from "../repositories/index.js"
import UserDTO from "../dao/DTOs/user.dto.js"
import userService from "../dao/models/user.model.js"
export const getHome = async (req, res) => {
    if (req.cookies.cookieToken) {
        return res.redirect("/products")
    } else {
        res.redirect("/login")
    }
}

export const getRealTimeProducts = async (req, res) => {
    const products = await productService.getProducts()
    res.render("realTimeProducts", {
        style: "home.css",
        products
    })
}

export const getChat = async (req, res) => {
    res.render("chat", {
        style: "home.css",
        user: req.user.first_name
    })
}

export const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    const category = req.query.category
    const sort = req.query.sort
    const stat = req.query.stat
    const products = await productService.getProducts(limit, page, category, sort, stat)
    let first_name, last_name, admin, cart, cartId
    if (req.cookies.cookieToken) {
        first_name = req.user.first_name
        last_name = req.user.last_name
        cart = req.user.cart
        cartId = req.user.cartId
    }
    if (req.user.role === "admin") {
        admin = "Admin"
    } else if (req.user.role === "user") {
        admin = "User"
    } else {
        admin = "Premium"
    }
    res.render("products", {
        style: "home.css",
        products,
        first_name,
        last_name,
        cart,
        admin,
        cartId
    })
}

export const getCarts = async (req, res) => {
    const cartId = req.params.cid
    const cart = await cartService.getCartById(cartId)
    res.render("cart", {
        style: "home.css",
        cart
    })
}

export const getLogin = async (req, res) => {
    if (req.cookies.cookieToken) {
        return res.redirect("/products")
    }
    res.render("login", {
        style: "home.css"
    })
}

export const getRegister = async (req, res) => {
    if (req.cookies.cookieToken) {
        return res.redirect("/products")
    }
    res.render("register", {
        style: "home.css"
    })
}

export const getProfile = async (req, res) => {
    if (!req.cookies.cookieToken || !req.user) {
        return res.redirect("/login")
    }

    const { first_name, last_name, email, age, role } = req.user
    res.render("profile", {
        first_name, last_name, email, age, role,
        style: "home.css"
    })
}

export const getLogout = (req, res) => {
    req.logger.info('User logged out')
    res.clearCookie(config.cookieToken).redirect("/login")
}

export const getResetPassword = async (req, res) => {
    const token = req.params.token
    res.render("resetPassword", {
        token,
        style: "home.css"
    })
}

export const getRecoverPassword = async (req, res) => {
    res.render("recoverPassword", {
        style: "home.css"
    })
}

export const getUsers = async (req, res) => {
    const users = await userService.find()
    const usersDTO = users.map(user => new UserDTO(user));
    res.render("users", {
        users: usersDTO,
        style: "home.css"
    })
}

export const getError = async (req, res) => {
    const status = req.query.status
    const message = req.query.message
    res.render("error", {
        style: "home.css",
        status,
        message
    })
}