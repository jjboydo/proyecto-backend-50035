import express from "express"
import { deleteProduct, getProductById, getProducts, mockProducts, updateProduct, updateProductSocket } from "../controllers/productsController.js"
import applyPolicy from "../middlewares/auth.middleware.js"
import { checkOwnership, passportCall } from "../utils.js"

export default (socketServer) => {

    const router = express.Router()

    // MOCKING

    router.get("/mockingproducts", mockProducts)

    // ENDPOINTS

    router.get("/", getProducts)

    router.get("/:pid", getProductById)

    router.post("/", passportCall('jwt'), applyPolicy(["ADMIN", "USER_PREMIUM"]), updateProductSocket(socketServer))

    router.put("/:pid", passportCall('jwt'), applyPolicy(["ADMIN", "USER_PREMIUM"]), updateProduct(socketServer))

    router.delete("/:pid", passportCall('jwt'), applyPolicy(["ADMIN", "USER_PREMIUM"]), checkOwnership(), deleteProduct(socketServer))


    return router

}
