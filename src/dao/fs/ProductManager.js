import fs from 'fs/promises'

export default class ProductManager {
    constructor(path) {
        this.path = path
        this.createFile()
        this.loadProducts()
    }

    async createFile() {
        try {
            await fs.access(this.path, fs.constants.F_OK)
        } catch (error) {
            if (error.code === "ENOENT") {
                await fs.writeFile(this.path, "[]")
                req.logger.info(`Product file created: ${this.path}`)
            } else {
                throw new Error("Error accessing product file:", error)
            }
        }
    }

    async loadProducts() {
        this.products = await this.getProducts()
    }

    #validateCode(code) {
        if (!this.products) return
        const result = this.products.some(product => product.code === code)
        if (result) throw new Error("There is already a product with that code")
    }

    #validateProduct(product) {
        const { title, description, price, code, stock, category } = product
        const isValid = title && description && price && code && stock && category
        if (!isValid) throw new Error("The product is not valid")
    }

    async writeToFile(array, path) {
        try {
            let productsString = JSON.stringify(array, null, '\t');
            await fs.writeFile(path, productsString);
        } catch (error) {
            console.error('Error writing products file:', error);
        }
    }

    async addProduct(product) {
        try {
            await this.loadProducts()
            this.#validateCode(product.code)
            this.#validateProduct(product)
            const maxProductId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) : 0
            const newProductId = maxProductId + 1
            const newProduct = {
                id: newProductId,
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status === undefined ? true : product.status,
                stock: product.stock,
                category: product.category,
                thumbnails: product.thumbnails || [],
            }
            this.products.push(newProduct)
            await this.writeToFile(this.products, this.path)
            req.logger.info("Product added successfully!")
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProducts() {
        try {
            const productsString = await fs.readFile(this.path, 'utf8')
            if (!productsString) {
                return []
            }
            return JSON.parse(productsString)
        } catch (error) {
            console.error('Error reading product file: ', error)
            return []
        }
    }

    getProductsById(productId) {
        const productExists = this.products.find(product => product.id === productId)
        return productExists
    }

    async updateProduct(productId, fieldsToUpdate) {
        try {
            const productExists = this.products.findIndex(product => product.id === productId)
            if (productExists === -1) {
                throw new Error("Product Not found")
            }
            delete fieldsToUpdate.id
            this.#validateCode(fieldsToUpdate.code)
            Object.assign(this.products[productExists], fieldsToUpdate)
            await this.writeToFile(this.products, this.path)
            req.logger.info("Product modified successfully!")
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async deleteProduct(productId) {
        try {
            const productsFilter = this.products.filter(product => product.id !== productId)
            if (productsFilter.length === this.products.length) {
                throw new Error("Product Not found")
            }
            this.products = productsFilter
            await this.writeToFile(this.products, this.path)
            req.logger.info("Product deleted successfully!")
        } catch (error) {
            throw new Error(error.message)
        }
    }
}