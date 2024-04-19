import express from "express"
import { deleteProduct, getProductById, getProducts, updateProduct, updateProductSocket } from "../controllers/productsController.js"
import { authorization, passportCall } from "../utils.js"

export default (socketServer) => {

    const router = express.Router()

    // ENDPOINTS

    router.get("/", getProducts)

    router.get("/:pid", getProductById)

    router.post("/", passportCall('jwt'), authorization("admin"), updateProductSocket)

    router.put("/:pid", passportCall('jwt'), authorization("admin"), updateProduct)

    router.delete("/:pid", passportCall('jwt'), authorization("admin"), deleteProduct)

    return router

}
