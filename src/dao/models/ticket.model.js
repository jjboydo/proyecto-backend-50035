import mongoose from "mongoose";

const ticketsCollection = "tickets"

const ticketsSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, default: function () { return Date.now() + Math.random().toString(36) } },
    purchase_datetime: { type: Date, required: true, default: Date.now },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true }
})

const ticketsModel = mongoose.model(ticketsCollection, ticketsSchema)

export default ticketsModel