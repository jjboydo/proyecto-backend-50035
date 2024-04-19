import ProductDAO from "../dao/mongoose/ProductDAO.js";

const productDAO = new ProductDAO()

export default class CartService {
    constructor(dao) {
        this.dao = dao
    }

    async #productExists(productId) {
        if (!productId || productId.length !== 24) {
            throw new Error(`Product ${productId} does not exist!`)
        }
        const product = await productDAO.getProductById(productId);
        if (!product) throw new Error(`Product ${productId} does not exist!`);
    }
    async addCart() {
        try {
            let result = await this.dao.createCart()
            console.log("Carrito agregado correctamente!")
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCarts() {
        try {
            let result = await this.dao.getCarts()
            return result
        } catch (error) {
            console.error('Error getting carts: ', error)
            return []
        }
    }

    async getCartById(cartId) {
        if (!cartId || cartId.length !== 24) {
            console.log('Invalid cart ID')
            return
        }
        const cartExists = await this.dao.getCartById(cartId)
        return cartExists
    }

    async addProductToCart(cartId, productId) {
        try {

            const cart = await this.getCartById(cartId)
            if (!cart) throw new Error(`Cart ${cartId} does not exist!`)

            await this.#productExists(productId)

            const productExists = cart.products.find(p => p.product._id.toString() === productId)
            if (productExists) {
                productExists.quantity++
            } else {
                const newProduct = {
                    product: productId,
                    quantity: 1
                }
                cart.products.push(newProduct)
            }
            await this.dao.updateCart(cartId, cart)
            console.log(`Producto agregado al carrito ${cartId} correctamente!`)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId)
            if (!cart) throw new Error(`Cart ${cartId} does not exist!`)

            await this.#productExists(productId)
            let productsUpdated = cart.products.filter(p => p.product._id.toString() !== productId)
            if (cart.products.length === productsUpdated.length) throw new Error(`Product ${productId} does not exist!`)

            cart.products = productsUpdated
            await this.dao.updateCart(cartId, cart)
            console.log(`Producto eliminado del carrito ${cartId} correctamente!`)
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateProductFromCart(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId)
            if (!cart) throw new Error(`Cart ${cartId} does not exist!`)

            await this.#productExists(productId)
            await this.dao.updateProductFromCart({ _id: cartId, "products.product": productId }, { $set: { "products.$.quantity": quantity } })
            console.log("Cantidad actualizada correctamente!")
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await this.getCartById(cartId)
            if (!cart) throw new Error(`Cart ${cartId} does not exist!`)

            await this.dao.updateProductFromCart({ _id: cartId }, { $set: { products: updatedProducts } })
            console.log("Carrito actualizado correctamente!")
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await this.getCartById(cartId)
            if (cart.products.length === 0) throw new Error(`Cart ${cartId} has no products!`)
            await this.dao.deleteCart(cartId)
            console.log("Carrito eliminado correctamente!")
        } catch (error) {
            throw new Error(`Cart ${cartId} has no products!`)
        }
    }
}