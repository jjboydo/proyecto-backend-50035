import express from "express"
import ProductManager from '../ProductManager.js'
import { fileURLToPath } from 'url'
import path from "path"

const __fliename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fliename)

const router = express.Router()

const productManager = new ProductManager(path.join(__dirname, "../products.json"))

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
        res.status(200).json({ success: "Product added correctly!" })
    } catch (error) {
        res.status(400).json({ error: `Adding product. ${error}` })
    }
})

router.put("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const updatedProduct = req.body
        await productManager.updateProduct(productId, updatedProduct)
        res.status(200).json({ success: `Product ${productId} successfully modified!` })
    } catch (error) {
        res.status(400).json({ error: `Updating product. ${error}` })
    }
})

router.delete("/:pid", async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        await productManager.deleteProduct(productId)
        res.status(200).json({ success: `Product ${productId} deleted successfully!` })
    } catch (error) {
        res.status(400).json({ error: `Deleting product. ${error}` })
    }
})

export default router