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

router.delete("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        await cartManager.deleteProductFromCart(cartId, productId)
        res.status(200).json({ success: `Product ${productId} removed from cart ${cartId} successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Deleting product from cart. ${error}` })
    }
})

router.put("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid
        const updatedProducts = req.body
        await cartManager.updateCart(cartId, updatedProducts.products)
        res.status(200).json({ success: `Products updated in cart ${cartId} successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Updating cart. ${error}` })
    }
})

router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const newQuantity = req.body
        await cartManager.updateProductFromCart(cartId, productId, newQuantity.quantity)
        res.status(200).json({ success: `Product ${productId} from cart ${cartId} updated successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Updating product in cart. ${error}` })
    }
})

router.delete("/:cid", async (req, res) => {
    try {
        const cartId = req.params.cid
        await cartManager.deleteCart(cartId)
        res.status(200).json({ success: `Cart ${cartId} removed successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Deleting cart. ${error}` })
    }
})

export default router