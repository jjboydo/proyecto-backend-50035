import express from "express"
import ProductManager from "../ProductManager.js"
import { fileURLToPath } from 'url'
import path from "path"

export default (socketServer) => {

    const __fliename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__fliename)

    const productManager = new ProductManager(path.join(__dirname, "../products.json"))


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
        // socketServer.emit('product_refresh', products)
    })

    return router
}