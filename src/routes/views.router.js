import express from "express"
import CartManager from "../dao/mongoose/CartManager.js"
import ProductManager from "../dao/mongoose/ProductManager.js"

const productManager = new ProductManager()
const cartManager = new CartManager()

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
    const products = await productManager.getProducts()
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
    const products = await productManager.getProducts(limit, page, category, sort, stat)
    const cartsList = await cartManager.getCarts()
    let first_name, last_name, admin
    if (req.cookies.cookieToken) {
        first_name = req.user.first_name
        last_name = req.user.last_name
    }
    req.user.role === "admin" ? admin = "Admin" : admin = "User"
    res.render("products", {
        style: "home.css",
        products,
        cartsList,
        first_name,
        last_name,
        admin
    })
})

router.get("/carts/:cid", async (req, res) => {
    const cartId = req.params.cid
    const cart = await cartManager.getCartById(cartId)
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
    res.clearCookie("cookieToken").redirect("/login")
})

export default router