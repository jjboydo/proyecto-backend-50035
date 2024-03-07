import mongoose from "mongoose";

const usersCollection = "users"

const usersSchema = new mongoose.Schema({
    first_name: { type: String, required: true, max: 50 },
    last_name: { type: String, required: true, max: 50 },
    email: { type: String, required: true, max: 50 },
    age: { type: Number, required: true, min: 0, max: 100 },
    password: { type: String, required: true }
})

const usersModel = mongoose.model(usersCollection, usersSchema)

export default usersModel