import express from "express"
import CartService from "../services/cartServices.js"
import ProductService from "../services/productServices.js"
import config from "../config/config.js"

const productService = new ProductService()
const cartService = new CartService()

const router = express.Router()

// VISTAS

router.get("/", async (req, res) => {
    if (req.cookies.cookieToken) {
        return res.redirect("/products")
    } else {
        res.redirect("/login")
    }
})

router.get("/realtimeproducts", async (req, res) => {
    const products = await productService.getProducts()
    res.render("realTimeProducts", {
        style: "home.css",
        products
    })
})

router.get("/chat", async (req, res) => {
    res.render("chat", {
        style: "home.css"
    })
})

router.get("/products", async (req, res) => {
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
})

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid
    const cart = await cartService.getCartById(cartId)
    res.render("cart", {
        style: "home.css",
        cart
    })
})

// VISTAS DE LOGIN

router.get("/login", async (req, res) => {
    if (req.cookies.cookieToken) {
        return res.redirect("/products")
    }
    res.render("login", {
        style: "home.css"
    })
})

router.get("/register", async (req, res) => {
    if (req.cookies.cookieToken) {
        return res.redirect("/products")
    }
    res.render("register", {
        style: "home.css"
    })
})

router.get("/profile", async (req, res) => {
    if (!req.cookies.cookieToken) {
        return res.redirect("/login")
    }

    const { first_name, last_name, email, age } = req.user
    res.render("profile", {
        first_name, last_name, email, age,
        style: "home.css"
    })
})

router.get('/logout', (req, res) => {
    // req.session.destroy(err => {
    //     if (err) {
    //         return res.json({ status: 'error logout', body: err })
    //     }
    //     console.log("Logout OK")
    //     res.redirect("/login")
    // })
    res.clearCookie(config.cookieToken).redirect("/login")
})

export default router