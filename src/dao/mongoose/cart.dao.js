import cartsModel from '../models/carts.model.js';

export default class CartDAO {
    async createCart() {
        return await cartsModel.create({
            products: []
        });
    }

    async getCarts() {
        return await cartsModel.find().lean();
    }

    async getCartById(cartId) {
        return await cartsModel.findById(cartId).populate("products.product").lean();
    }

    async updateCart(cartId, cart) {
        return await cartsModel.updateOne({ _id: cartId }, cart);
    }

    async updateProductFromCart(filter, options) {
        return await cartsModel.updateOne(filter, options)
    }

    async deleteCart(cartId) {
        return await cartsModel.updateOne({ _id: cartId }, { $set: { products: [] } });
    }

    async deleteTestCart(cartId) {
        return await cartsModel.deleteOne({ _id: cartId });
    }
}