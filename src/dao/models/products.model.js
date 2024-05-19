import { de } from "@faker-js/faker";
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productsCollection = "products"

const productsSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 30 },
    description: { type: String, required: true, max: 50 },
    price: { type: Number, required: true, min: 0 },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0 },
    status: { type: Boolean, required: false, default: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], required: false },
    owner: { type: String, default: "admin" }
})

productsSchema.plugin(mongoosePaginate)
const productsModel = mongoose.model(productsCollection, productsSchema)

export default productsModel