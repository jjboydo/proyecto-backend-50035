import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import { generateProductCodeErrorInfo, generateProductErrorInfo, generateProductExistsErrorInfo } from "../services/errors/info.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger()

export default class ProductRepository {
    constructor(dao) {
        this.dao = dao
    }

    async #validateCode(code) {
        const product = await this.dao.findProductByCode(code);
        if (product) {
            throw new CustomError({
                name: `Product Error`,
                cause: generateProductCodeErrorInfo(code),
                message: 'Error adding-updating a product',
                code: EErrors.INVALID_TYPES_ERROR
            })
        }
    }

    #validateProduct(product) {
        const { title, description, price, code, stock, category } = product
        const isValid = title && description && price && code && stock && category
        if (!isValid) {
            throw new CustomError({
                name: `Product Error`,
                cause: generateProductErrorInfo({ title, description, price, code, stock, category }),
                message: 'Error adding-updating a product',
                code: EErrors.MISSING_DATA
            })
        }
    }

    async addProduct(product) {
        try {
            await this.#validateCode(product.code)
            this.#validateProduct(product)
            await this.dao.createProduct({
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: product.status === undefined ? true : product.status,
                stock: product.stock,
                category: product.category,
                thumbnails: product.thumbnails || [],
            })
            logger.info("Product added successfully!")
        } catch (error) {
            logger.error("Error adding a product: ")
            throw error
        }
    }

    async getProducts(limit, page, category, sort, stat) {
        try {
            let categoryObject
            let statusObject
            isNaN(limit) ? limit = 10 : limit
            isNaN(page) ? page = 1 : page
            category ? categoryObject = { category: category } : categoryObject = {}
            stat ? statusObject = { status: stat } : statusObject = {}
            let filter = { ...categoryObject, ...statusObject }
            let result = sort ? await this.dao.getProducts(filter, { limit: limit, page: page, lean: true, sort: { price: sort } }) : await this.dao.getProducts(filter, { limit: limit, page: page, lean: true })
            result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${category ? `&category=${category}` : ""}${stat ? `&status=${stat}` : ""}` : ''
            result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${category ? `&category=${category}` : ""}${stat ? `&status=${stat}` : ""}` : ''
            const productsResponse = {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                prevLink: result.prevLink,
                nextLink: result.nextLink
            }
            return productsResponse
        } catch (error) {
            logger.error('Error getting products')
            return []
        }
    }

    async getProductsById(productId) {
        if (!productId || productId.length !== 24) {
            logger.warning('Invalid product ID')
            return
        }
        const productExists = await this.dao.getProductById(productId)
        return productExists
    }

    async updateProduct(productId, fieldsToUpdate) {
        try {
            delete fieldsToUpdate.id
            await this.#validateCode(fieldsToUpdate.code)
            await this.dao.updateProduct(productId, fieldsToUpdate)
            logger.info("Product modified successfully!")
        } catch (error) {
            logger.error("Error updating a product: ")
            throw error
        }
    }

    async deleteProduct(productId) {
        try {
            const product = await this.getProductsById(productId)
            if (!product) {
                throw new CustomError({
                    name: `Product Error`,
                    cause: generateProductExistsErrorInfo(productId),
                    message: 'Error deleting a product',
                    code: EErrors.MISSING_DATA
                })
            }
            await this.dao.deleteProduct(productId)
            logger.info("Product deleted successfully!")
        } catch (error) {
            logger.error("Error deleting a product: ")
            throw error
        }
    }
}