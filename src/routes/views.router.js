import express from "express"
import ProductManager from "../dao/mongoose/ProductManager.js"

const productManager = new ProductManager()

const router = express.Router()

// VISTAS

router.get("/", async (req, res) => {
    const products = await productManager.getProducts()
    const productsObjects = products.map(product => product.toObject())
    res.render("home", {
        style: "home.css",
        productsObjects
    })
})

router.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts()
    const productsObjects = products.map(product => product.toObject())
    res.render("realTimeProducts", {
        style: "home.css",
        productsObjects
    })
})

router.get("/chat", async (req, res) => {
    res.render("chat", {
        style: "home.css"
    })
})

router.get("/products", async (req, res) => {
    res.render("products", {
        style: "home.css"
    })
})

export default router