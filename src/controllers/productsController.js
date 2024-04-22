import { productService } from "../repositories/index.js"

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

export const updateProductSocket = (socketServer) => async (req, res) => {
    try {
        const newProduct = req.body
        await productService.addProduct(newProduct)
        const products = await productService.getProducts()
        socketServer.emit('product_updated', products)
        res.status(200).json({ success: "Product added correctly!" })
    } catch (error) {
        res.status(500).json({ error: `Adding product. ${error}` })
    }
}

export const updateProduct = (socketServer) => async (req, res) => {
    try {
        const productId = req.params.pid
        const updatedProduct = req.body
        await productService.updateProduct(productId, updatedProduct)
        const products = await productService.getProducts()
        socketServer.emit('product_updated', products)
        res.status(200).json({ success: `Product ${productId} successfully modified!` })
    } catch (error) {
        res.status(500).json({ error: `Updating product. ${error}` })
    }
}

export const deleteProduct = (socketServer) => async (req, res) => {
    try {
        const productId = req.params.pid
        await productService.deleteProduct(productId)
        const products = await productService.getProducts()
        socketServer.emit('product_updated', products)
        res.status(200).json({ success: `Product ${productId} deleted successfully!` })
    } catch (error) {
        res.status(500).json({ error: `Deleting product. ${error}` })
    }
}