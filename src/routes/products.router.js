import express from "express"
import ProductManager from '../dao/mongoose/ProductDAO.js'
import path from 'path'
import __dirname from "../utils.js"
import { getProducts, deleteProduct, updateProductSocket, getProductById, updateProduct } from "../controllers/productsController.js"

export default (socketServer) => {

    const router = express.Router()

    // ENDPOINTS

    router.get("/", getProducts)

    router.get("/:pid", getProductById)

    router.post("/", updateProductSocket)

    router.put("/:pid", updateProduct)

    router.delete("/:pid", deleteProduct)

    return router

}
