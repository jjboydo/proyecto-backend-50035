import config from "../config/config.js"
import { cartService, productService } from "../services/index.js"
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
        style: "home.css"
    })
}

export const getProducts = async (req, res) => {
    const limit = parseInt(req.query.limit)
    const page = parseInt(req.query.page)
    const category = req.query.category
    const sort = req.query.sort
    const stat = req.query.stat
    const products = await productService.getProducts(limit, page, category, sort, stat)
    let first_name, last_name, admin, cart
    if (req.cookies.cookieToken) {
        first_name = req.user.first_name
        last_name = req.user.last_name
        cart = req.user.cart
    }
    req.user.role === "admin" ? admin = "Admin" : admin = "User"
    res.render("products", {
        style: "home.css",
        products,
        first_name,
        last_name,
        cart,
        admin
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
    if (!req.cookies.cookieToken) {
        return res.redirect("/login")
    }

    const { first_name, last_name, email, age } = req.user
    res.render("profile", {
        first_name, last_name, email, age,
        style: "home.css"
    })
}

export const getLogout = (req, res) => {
    // req.session.destroy(err => {
    //     if (err) {
    //         return res.json({ status: 'error logout', body: err })
    //     }
    //     console.log("Logout OK")
    //     res.redirect("/login")
    // })
    res.clearCookie(config.cookieToken).redirect("/login")
}