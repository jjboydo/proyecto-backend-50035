import express from "express"
import ProductManager from "../dao/mongoose/ProductManager.js"
import CartManager from "../dao/mongoose/CartManager.js"

const productManager = new ProductManager()
const cartManager = new CartManager()

const router = express.Router()

// VISTAS

router.get("/", async (req, res) => {
    const products = await productManager.getProducts()
    res.render("home", {
        style: "home.css",
        products
    })
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
    res.render("products", {
        style: "home.css",
        products,
        cartsList
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

export default router