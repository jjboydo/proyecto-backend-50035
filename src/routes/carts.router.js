import express from "express"
import CartManager from '../dao/mongoose/CartManager.js'

const router = express.Router()

const cartManager = new CartManager()

// ENDPOINTS

router.post("/", async (req, res) => {
    try {
        await cartManager.addCart()
        res.status(200).json({ success: "Cart added correctly!" })
    } catch (error) {
        res.status(500).json({ error: `Adding new cart. ${error}` })
    }
})

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid
    const cart = await cartManager.getCartById(cartId)
    if (!cart) res.status(404).json({ error: `Cart ${cartId} does not exist!` })
    res.json(cart)
})

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        await cartManager.addProductToCart(cartId, productId)
        res.status(200).json({ success: `Product ${productId} added to cart ${cartId} successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Adding new product to cart. ${error}` })
    }
})

export default router