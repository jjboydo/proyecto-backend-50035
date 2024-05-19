import { productService } from "../repositories/index.js"
import { generateProduct } from "../utils.js"

export const getProducts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit)
        const page = parseInt(req.query.page)
        const category = req.query.category
        const sort = req.query.sort
        const status = req.query.status
        const products = await productService.getProducts(limit, page, category, sort, status)
        res.json(products)
    } catch (error) {
        const productsResponse = {
            status: "error",
            payload: []
        }
        res.status(500).json(productsResponse)
    }
}

export const getProductById = async (req, res) => {
    const productId = req.params.pid
    const product = await productService.getProductsById(productId)
    if (!product) res.status(404).json({ error: `Product ${productId} does not exist!` })
    res.json(product)
}

export const updateProductSocket = (socketServer) => async (req, res, next) => {
    try {
        const newProduct = req.body
        await productService.addProduct(newProduct, req.user.role === 'admin' ? null : req.user.email)
        const products = await productService.getProducts()
        socketServer.emit('product_updated', products)
        res.status(200).json({ success: "Product added correctly!" })
    } catch (error) {
        next(error)
    }
}

export const updateProduct = (socketServer) => async (req, res, next) => {
    try {
        const productId = req.params.pid
        const updatedProduct = req.body
        await productService.updateProduct(productId, updatedProduct)
        const products = await productService.getProducts()
        socketServer.emit('product_updated', products)
        res.status(200).json({ success: `Product ${productId} successfully modified!` })
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = (socketServer) => async (req, res, next) => {
    try {
        const productId = req.params.pid
        await productService.deleteProduct(productId)
        const products = await productService.getProducts()
        socketServer.emit('product_updated', products)
        res.status(200).json({ success: `Product ${productId} deleted successfully!` })
    } catch (error) {
        next(error)
    }
}

export const mockProducts = async (req, res) => {
    let products = []

    for (let index = 0; index < 100; index++) {
        products.push(generateProduct())
    }

    res.send({ status: "success", payload: products })
}