import CartService from "../services/cartServices.js"

const cartService = new CartService()

export const addCart = async (req, res) => {
    try {
        await cartService.addCart()
        res.status(200).json({ success: "Cart added correctly!" })
    } catch (error) {
        res.status(500).json({ error: `Adding new cart. ${error}` })
    }
}

export const getCartById = async (req, res) => {
    const cartId = req.params.cid
    const cart = await cartService.getCartById(cartId)
    if (!cart) res.status(404).json({ error: `Cart ${cartId} does not exist!` })
    res.json(cart)
}

export const addProductToCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        await cartService.addProductToCart(cartId, productId)
        res.status(200).json({ success: `Product ${productId} added to cart ${cartId} successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Adding new product to cart. ${error}` })
    }
}

export const deleteProductFromCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        await cartService.deleteProductFromCart(cartId, productId)
        res.status(200).json({ success: `Product ${productId} removed from cart ${cartId} successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Deleting product from cart. ${error}` })
    }
}

export const updateCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const updatedProducts = req.body
        await cartService.updateCart(cartId, updatedProducts.products)
        res.status(200).json({ success: `Products updated in cart ${cartId} successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Updating cart. ${error}` })
    }
}

export const updateProductFromCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const newQuantity = req.body
        await cartService.updateProductFromCart(cartId, productId, newQuantity.quantity)
        res.status(200).json({ success: `Product ${productId} from cart ${cartId} updated successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Updating product in cart. ${error}` })
    }
}

export const deleteCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        await cartService.deleteCart(cartId)
        res.status(200).json({ success: `Cart ${cartId} removed successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Deleting cart. ${error}` })
    }
}