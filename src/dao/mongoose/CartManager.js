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
            await cartsModel.create({
                products: []
            })
            console.log("Carrito agregado correctamente!")
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCarts() {
        try {
            let result = await cartsModel.find()
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
        const cartExists = await cartsModel.findById(cartId)
        return cartExists
    }

    async addProductToCart(cartId, productId) {
        try {

            const cart = await this.getCartById(cartId)
            if (!cart) throw new Error(`Cart ${cartId} does not exist!`)

            await this.#productExists(productId)

            const productExists = cart.products.find(p => p.product.toString() === productId)
            if (productExists) {
                productExists.quantity++
            } else {
                const newProduct = {
                    product: productId,
                    quantity: 1
                }
                cart.products.push(newProduct)
            }
            await cart.save()
            console.log(`Producto agregado al carrito ${cartId} correctamente!`)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}