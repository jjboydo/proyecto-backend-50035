import { cartService } from "../repositories/index.js"

export const addCart = async (req, res, next) => {
    try {
        const createdCart = await cartService.addCart()
        res.status(200).json({ success: "Cart added correctly!", payload: createdCart._id })
    } catch (error) {
        next(error)
    }
}

export const getCartById = async (req, res) => {
    const cartId = req.params.cid
    const cart = await cartService.getCartById(cartId)
    if (!cart) res.status(404).json({ error: `Cart ${cartId} does not exist!` })
    res.json(cart)
}

export const addProductToCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        await cartService.addProductToCart(cartId, productId)
        res.status(200).json({ success: `Product ${productId} added to cart ${cartId} successfully!` })
    } catch (error) {
        next(error)
    }
}

export const deleteProductFromCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        await cartService.deleteProductFromCart(cartId, productId)
        res.status(200).json({ success: `Product ${productId} removed from cart ${cartId} successfully!` })
    } catch (error) {
        next(error)
    }
}

export const updateCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid
        const updatedProducts = req.body
        await cartService.updateCart(cartId, updatedProducts.products)
        res.status(200).json({ success: `Products updated in cart ${cartId} successfully!` })
    } catch (error) {
        next(error)
    }
}

export const updateProductFromCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid
        const productId = req.params.pid
        const newQuantity = req.body
        await cartService.updateProductFromCart(cartId, productId, newQuantity.quantity)
        res.status(200).json({ success: `Product ${productId} from cart ${cartId} updated successfully!` })
    } catch (error) {
        next(error)
    }
}

export const deleteCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid
        await cartService.deleteCart(cartId)
        res.status(200).json({ success: `Cart ${cartId} removed successfully!` })
    } catch (error) {
        next(error)
    }
}

export const deleteTestCart = async (req, res, next) => {
    try {
        const cartId = req.params.cid
        await cartService.deleteTestCart(cartId)
        res.status(200).json({ success: `Cart ${cartId} removed successfully!` })
    } catch (error) {
        next(error)
    }
}

export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid
        const userEmail = req.user.email

        const { productsPurchased, canceledProducts, total } = await cartService.purchaseCart(cartId, userEmail)

        if (productsPurchased.length === 0) {
            res.status(409).json({ success: `No products were purchased due to lack of stock` });
        } else if (canceledProducts.length > 0) {
            res.status(206).json({ success: `Purchase completed partially`, payload: canceledProducts })
        } else {
            res.status(200).json({ success: `Purchase completed successfully` })
        }

    } catch (error) {
        next(error)
    }
}