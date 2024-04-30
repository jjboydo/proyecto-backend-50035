import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateCartErrorInfo, generateEmptyCartErrorInfo, generateProductExistsErrorInfo } from "../services/errors/info.js";
import { productService, ticketService } from "./index.js";

export default class CartRepository {
    constructor(dao) {
        this.dao = dao
    }

    async #productExists(productId) {
        if (!productId || productId.length !== 24) {
            throw new CustomError({
                name: `Product Error`,
                cause: generateProductExistsErrorInfo(productId),
                message: 'Error searching for a product',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
        const product = await productService.getProductsById(productId);
        if (!product) {
            throw new CustomError({
                name: `Product Error`,
                cause: generateProductExistsErrorInfo(productId),
                message: 'Error searching for a product',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
    }
    async addCart() {
        try {
            let result = await this.dao.createCart()
            console.log("Carrito agregado correctamente!")
            return result
        } catch (error) {
            throw error;
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
        try {
            if (!cartId || cartId.length !== 24) {
                console.log('Invalid cart ID')
                return
            }
            const cartExists = await this.dao.getCartById(cartId)
            return cartExists
        } catch (error) {
            throw error;
        }
    }

    async addProductToCart(cartId, productId) {
        try {

            const cart = await this.getCartById(cartId)
            if (!cart) {
                throw new CustomError({
                    name: `Cart Error`,
                    cause: generateCartErrorInfo(cartId),
                    message: 'Error searching for a cart',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

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
            throw error;
        }
    }

    async deleteProductFromCart(cartId, productId) {
        try {
            const cart = await this.getCartById(cartId)
            if (!cart) {
                throw new CustomError({
                    name: `Cart Error`,
                    cause: generateCartErrorInfo(cartId),
                    message: 'Error searching for a cart',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            await this.#productExists(productId)
            let productsUpdated = cart.products.filter(p => p.product._id.toString() !== productId)
            if (cart.products.length === productsUpdated.length) {
                throw new CustomError({
                    name: `Product Error`,
                    cause: generateProductExistsErrorInfo(productId),
                    message: 'Error searching for a product',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            cart.products = productsUpdated
            await this.dao.updateCart(cartId, cart)
            console.log(`Producto eliminado del carrito ${cartId} correctamente!`)
        } catch (error) {
            throw error;
        }
    }

    async updateProductFromCart(cartId, productId, quantity) {
        try {
            const cart = await this.getCartById(cartId)
            if (!cart) {
                throw new CustomError({
                    name: `Cart Error`,
                    cause: generateCartErrorInfo(cartId),
                    message: 'Error searching for a cart',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            await this.#productExists(productId)
            await this.dao.updateProductFromCart({ _id: cartId, "products.product": productId }, { $set: { "products.$.quantity": quantity } })
            console.log("Cantidad actualizada correctamente!")
        } catch (error) {
            throw error;
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await this.getCartById(cartId)
            if (!cart) {
                throw new CustomError({
                    name: `Cart Error`,
                    cause: generateCartErrorInfo(cartId),
                    message: 'Error searching for a cart',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            await this.dao.updateProductFromCart({ _id: cartId }, { $set: { products: updatedProducts } })
            console.log("Carrito actualizado correctamente!")
        } catch (error) {
            throw error;
        }
    }

    async deleteCart(cartId) {
        try {
            const cart = await this.getCartById(cartId)
            if (!cart) {
                throw new CustomError({
                    name: `Cart Error`,
                    cause: generateCartErrorInfo(cartId),
                    message: 'Error searching for a cart',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }
            if (cart.products.length === 0) {
                throw new CustomError({
                    name: `Cart Error`,
                    cause: generateEmptyCartErrorInfo(cartId),
                    message: 'Error deleting a cart',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }
            await this.dao.deleteCart(cartId)
            console.log("Carrito eliminado correctamente!")
        } catch (error) {
            throw error;
        }
    }

    async purchaseCart(cartId, userEmail) {
        const cart = await this.getCartById(cartId)
        let productsPurchased = []
        let canceledProducts = []
        let total = 0

        if (cart.products.length === 0) {
            throw new CustomError({
                name: `Cart Error`,
                cause: generateEmptyCartErrorInfo(cartId),
                message: 'Error getting a cart',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }

        for (let i = 0; i < cart.products.length; i++) {
            let productInCart = cart.products[i]
            let product = await productService.getProductsById(productInCart.product._id.toString())

            if (product.stock < productInCart.quantity) {
                canceledProducts.push(product._id.toString())
            } else {
                total += product.price * productInCart.quantity
                product.stock -= productInCart.quantity
                await product.save()
                productsPurchased.push(product)
            }
        }

        cart.products = cart.products.filter(productCart => {
            return canceledProducts.includes(productCart.product._id.toString())
        })

        await this.updateCart(cartId, cart.products)

        if (productsPurchased.length > 0) {
            const newTicket = {
                amount: total,
                purchaser: userEmail
            }

            await ticketService.createTicket(newTicket)
        }

        return { productsPurchased, canceledProducts, total }
    }
}