import express from "express"
import CartManager from '../CartManager.js'
import { fileURLToPath } from 'url'
import path from "path"

const __fliename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__fliename)

const router = express.Router()

const cartManager = new CartManager(path.join(__dirname, "../carts.json"))

// ENDPOINTS

router.post("/", async (req, res) => {
    try {
        await cartManager.addCart()
        res.status(200).json({ success: "Cart added correctly!" })
    } catch (error) {
        res.status(400).json({ error: `Adding new cart. ${error}` })
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid)
    const cart = await cartManager.getCartById(cartId)
    if (!cart) res.status(404).json({ error: `Cart ${cartId} does not exist!` })
    res.json(cart)
})

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid)
        const productId = parseInt(req.params.pid)
        await cartManager.addProductToCart(cartId, productId)
        res.status(200).json({ success: `Product ${productId} added to cart ${cartId} successfully!` })
    } catch (error) {
        res.status(400).json({ error: `Adding new product to cart. ${error}` })
    }
})

export default router