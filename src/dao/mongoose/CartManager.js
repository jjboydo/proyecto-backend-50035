import productsModel from '../models/products.model.js'
import cartsModel from '../models/carts.model.js'

export default class CartManager {

    async #productExists(productId) {
        if (!productId || productId.length !== 24) {
            throw new Error(`Product ${productId} does not exist!`)
        }
        const product = await productsModel.findById(productId);
        if (!product) throw new Error(`Product ${productId} does not exist!`);
    }
    async addCart() {
        try {
            let result = await cartsModel.create({
                products: []
            })
            console.log("Carrito agregado correctamente!")
            return result
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCarts() {
        try {
            let result = await cartsModel.find().lean()
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
        const cartExists = await cartsModel.findById(cartId).populate("products.product").lean()
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
            await cartsModel.updateOne({ _id: cartId }, cart)
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
            await cartsModel.updateOne({ _id: cartId }, cart)
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
            await cartsModel.updateOne({ _id: cartId, "products.product": productId }, { $set: { "products.$.quantity": quantity } })
            console.log("Cantidad actualizada correctamente!")
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await this.getCartById(cartId)
            if (!cart) throw new Error(`Cart ${cartId} does not exist!`)

            await cartsModel.updateOne({ _id: cartId }, { $set: { products: updatedProducts } })
            console.log("Carrito actualizado correctamente!")
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await this.getCartById(cartId)
            if (cart.products.length === 0) throw new Error(`Cart ${cartId} has no products!`)
            await cartsModel.updateOne({ _id: cartId }, { $set: { products: [] } })
            console.log("Carrito eliminado correctamente!")
        } catch (error) {
            throw new Error(`Cart ${cartId} has no products!`)
        }
    }
}