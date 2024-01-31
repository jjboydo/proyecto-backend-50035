import express from "express"
import ProductManager from "../ProductManager.js"
import path from 'path'
import __dirname from "../utils.js"

const productManager = new ProductManager(path.join(__dirname, "./products.json"))

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

export default router