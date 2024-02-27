import mongoose from "mongoose";

const cartsCollection = "carts"

const productSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
    quantity: { type: Number, required: true, min: 1 }
})

const cartsSchema = new mongoose.Schema({
    products: { type: [productSchema], required: true }
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema)

export default cartsModel