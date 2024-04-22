import productsModel from "../models/products.model.js";

export default class ProductDAO {

    async findProductByCode(code) {
        return await productsModel.findOne({ code: code });
    }

    async createProduct(product) {
        return await productsModel.create(product);
    }

    async getProducts(filter, options) {
        return await productsModel.paginate(filter, options);
    }

    async getProductById(productId) {
        return await productsModel.findById(productId);
    }

    async updateProduct(productId, fieldsToUpdate) {
        return await productsModel.updateOne({ _id: productId }, fieldsToUpdate);
    }

    async deleteProduct(productId) {
        return await productsModel.deleteOne({ _id: productId });
    }
}