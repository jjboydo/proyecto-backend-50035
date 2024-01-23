import fs from 'fs/promises'
import ProductManager from './ProductManager.js'

const productManager = new ProductManager("./src/products.json")

export default class CartManager {
    constructor(path) {
        this.path = path
        this.loadCarts()
    }

    async loadCarts() {
        this.carts = await this.getCarts()
    }

    async writeToFile(array, path) {
        try {
            let cartsString = JSON.stringify(array, null, '\t');
            await fs.writeFile(path, cartsString);
        } catch (error) {
            console.error('Error writing carts file:', error);
        }
    }

    async addCart() {
        try {
            await this.loadCarts()
            const maxCartId = this.carts.length > 0 ? Math.max(...this.carts.map(c => c.id)) : 0
            const newCartId = maxCartId + 1
            const newCart = {
                id: newCartId,
                products: []
            }
            this.carts.push(newCart)
            await this.writeToFile(this.carts, this.path)
            console.log("Carrito agregado correctamente!")
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCarts() {
        try {
            const cartsString = await fs.readFile(this.path, 'utf8')
            if (!cartsString) {
                return []
            }
            return JSON.parse(cartsString)
        } catch (error) {
            console.error('Error reading carts file: ', error)
            return []
        }
    }

    getCartById(cartId) {
        const cartExists = this.carts.find(cart => cart.id === cartId)
        return cartExists
    }

    async addProductToCart(cartId, productId) {
        try {
            const cart = this.getCartById(cartId)
            if (!cart) throw new Error(`Cart ${cartId} does not exist!`)

            const product = await productManager.getProductsById(productId)
            if (!product) throw new Error(`Product ${productId} does not exist!`)

            const productExists = cart.products.find(p => p.product === productId)
            if (productExists) {
                productExists.quantity++
            } else {
                const newProduct = {
                    product: productId,
                    quantity: 1
                }
                cart.products.push(newProduct)
            }

            await this.writeToFile(this.carts, this.path)
            console.log(`Producto agregado al carrito ${cartId} correctamente!`)
        } catch (error) {
            throw new Error(error.message)
        }
    }
}