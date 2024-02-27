import productsModel from "../models/products.model.js";

export default class ProductManager {

    async #validateCode(code) {
        const product = await productsModel.findOne({ code: code });
        if (product) throw new Error("There is already a product with that code");
    }

    #validateProduct(product) {
        const { title, description, price, code, stock, category } = product
        const isValid = title && description && price && code && stock && category
        if (!isValid) throw new Error("The product is not valid")
    }

    async addProduct(product) {
        try {
            await this.#validateCode(product.code)
            this.#validateProduct(product)
            await productsModel.create({
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status === undefined ? true : product.status,
                stock: product.stock,
                category: product.category,
                thumbnails: product.thumbnails || [],
            })
            console.log("Producto agregado correctamente!")
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getProducts(limit, page, query, sort) {
        try {
            isNaN(limit) ? limit = 10 : limit
            isNaN(page) ? page = 1 : page
            query ? query = { category: query } : {}
            // OPTIMIZAR ESTO
            let result = sort ? await productsModel.paginate(query, { limit: limit, page: page, lean: true, sort: { price: sort } }) : await productsModel.paginate({}, { limit: limit, page: page, lean: true })
            result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : '';
            result.nextLink = result.hasNextPage ? `http://localhost:8080/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : '';
            result.isValid = !(page <= 0 || page > result.totalPages)
            return result
        } catch (error) {
            console.error('Error getting products: ', error)
            return []
        }
    }

    async getProductsById(productId) {
        if (!productId || productId.length !== 24) {
            console.log('Invalid product ID')
            return
        }
        const productExists = await productsModel.findById(productId)
        return productExists
    }

    async updateProduct(productId, fieldsToUpdate) {
        try {
            delete fieldsToUpdate.id
            await this.#validateCode(fieldsToUpdate.code)
            await productsModel.updateOne({ _id: productId }, fieldsToUpdate)
            console.log("Producto modificado correctamente!")
        } catch (error) {
            throw new Error(`Product ${productId} does not exist!`)
        }
    }

    async deleteProduct(productId) {
        try {
            await productsModel.deleteOne({ _id: productId })
            console.log("Producto eliminado correctamente!")
        } catch (error) {
            throw new Error(`Product ${productId} does not exist!`)
        }
    }
}