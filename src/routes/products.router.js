import express from "express"
import { deleteProduct, getProductById, getProducts, mockProducts, updateProduct, updateProductSocket } from "../controllers/productsController.js"
import { authorization, passportCall } from "../utils.js"

export default (socketServer) => {

    const router = express.Router()

    // MOCKING

    router.get("/mockingproducts", mockProducts)

    // ENDPOINTS

    router.get("/", getProducts)

    router.get("/:pid", getProductById)

    router.post("/", passportCall('jwt'), authorization("admin"), updateProductSocket(socketServer))

    router.put("/:pid", passportCall('jwt'), authorization("admin"), updateProduct(socketServer))

    router.delete("/:pid", passportCall('jwt'), authorization("admin"), deleteProduct(socketServer))


    return router

}
