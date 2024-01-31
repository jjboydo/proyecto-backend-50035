import express from "express"
import ProductManager from '../ProductManager.js'
import path from 'path'
import __dirname from "../utils.js"

export default (socketServer) => {

    const router = express.Router()

    const productManager = new ProductManager(path.join(__dirname, "./products.json"))

    // ENDPOINTS

    router.get("/", async (req, res) => {
        const limit = parseInt(req.query.limit)
        const products = await productManager.getProducts()
        const getProducts = (!isNaN(limit) && limit > 0) ? products.slice(0, limit) : products
        res.json(getProducts)
    })

    router.get("/:pid", async (req, res) => {
        const productId = parseInt(req.params.pid)
        const product = await productManager.getProductsById(productId)
        if (!product) res.status(404).json({ error: `Product ${productId} does not exist!` })
        res.json(product)
    })

    router.post("/", async (req, res) => {
        try {
            const newProduct = req.body
            await productManager.addProduct(newProduct)
            const products = await productManager.getProducts()
            socketServer.emit('product_updated', products)
            res.status(200).json({ success: "Product added correctly!" })
        } catch (error) {
            res.status(500).json({ error: `Adding product. ${error}` })
        }
    })

    router.put("/:pid", async (req, res) => {
        try {
            const productId = parseInt(req.params.pid)
            const updatedProduct = req.body
            await productManager.updateProduct(productId, updatedProduct)
            const products = await productManager.getProducts()
            socketServer.emit('product_updated', products)
            res.status(200).json({ success: `Product ${productId} successfully modified!` })
        } catch (error) {
            res.status(500).json({ error: `Updating product. ${error}` })
        }
    })

    router.delete("/:pid", async (req, res) => {
        try {
            const productId = parseInt(req.params.pid)
            await productManager.deleteProduct(productId)
            const products = await productManager.getProducts()
            socketServer.emit('product_updated', products)
            res.status(200).json({ success: `Product ${productId} deleted successfully!` })
        } catch (error) {
            res.status(500).json({ error: `Deleting product. ${error}` })
        }
    })

    return router

}
