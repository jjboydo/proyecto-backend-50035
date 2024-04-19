import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const ticketsCollection = "tickets"

const ticketsSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 30 },
    description: { type: String, required: true, max: 50 },
    price: { type: Number, required: true, min: 0 },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, required: true, min: 0 },
    status: { type: Boolean, required: false, default: true },
    category: { type: String, required: true },
    thumbnails: { type: [String], required: false }
})

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema)

export default ticketsModel