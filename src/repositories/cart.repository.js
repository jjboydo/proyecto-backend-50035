import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateCartErrorInfo, generateEmptyCartErrorInfo, generateProductExistsErrorInfo } from "../services/errors/info.js";
import { productService, ticketService } from "./index.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger()

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
            logger.info("Cart added successfully!")
            return result
        } catch (error) {
            logger.fatal("Error adding a cart: ")
            throw error;
        }
    }

    async getCarts() {
        try {
            let result = await this.dao.getCarts()
            return result
        } catch (error) {
            logger.fatal("Error getting carts: ")
            return []
        }
    }

    async getCartById(cartId) {
        try {
            if (!cartId || cartId.length !== 24) {
                logger.warning('Invalid cart ID')
                return
            }
            const cartExists = await this.dao.getCartById(cartId)
            return cartExists
        } catch (error) {
            req.logger.error('Error getting cart: ')
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
            logger.info(`Product added to cart ${cartId} correctly!`)
        } catch (error) {
            logger.error(`Error adding product to cart`)
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
            logger.info(`Product deleted from cart ${cartId} correctly!`)
        } catch (error) {
            logger.error(`Error deleting product from cart`)
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
            logger.info("Quantity updated successfully!")
        } catch (error) {
            logger.error("Error updating quantity")
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
            logger.info("Cart updated successfully!")
        } catch (error) {
            logger.error("Error updating cart")
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
            logger.info("Cart deleted successfully!")
        } catch (error) {
            logger.error("Error deleting cart")
            throw error;
        }
    }

    async deleteTestCart(cartId) {
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
            await this.dao.deleteTestCart(cartId)
            logger.info("Cart deleted successfully!")
        } catch (error) {
            logger.error("Error deleting cart")
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
                canceledProducts.push({
                    id: product._id.toString(),
                    name: product.title,
                })
            } else {
                total += product.price * productInCart.quantity
                product.stock -= productInCart.quantity
                await product.save()
                productsPurchased.push(product)
            }
        }

        cart.products = cart.products.filter(productCart => {
            return canceledProducts.some(canceledProduct => canceledProduct.id === productCart.product._id.toString())
        })


        if (productsPurchased.length > 0) {
            await this.updateCart(cartId, cart.products)
            const newTicket = {
                amount: total,
                purchaser: userEmail
            }

            await ticketService.createTicket(newTicket)
            logger.info(`Cart ${cartId} purchased successfully!`)
        }


        return { productsPurchased, canceledProducts, total }
    }
}