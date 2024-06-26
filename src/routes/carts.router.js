import express from "express"
import { addCart, getCartById, addProductToCart, deleteProductFromCart, updateCart, updateProductFromCart, deleteCart, purchaseCart, deleteTestCart } from "../controllers/cartsController.js"
import { verifyUserCart, passportCall, checkProductOwner } from "../utils.js"

const router = express.Router()

// ENDPOINTS

router.post("/", addCart)

router.get("/:cid", getCartById)

router.post("/:cid/product/:pid", passportCall('jwt'), verifyUserCart(), checkProductOwner(), addProductToCart)

router.delete("/:cid/product/:pid", deleteProductFromCart)

router.put("/:cid", updateCart)

router.put("/:cid/product/:pid", updateProductFromCart)

router.delete("/:cid", deleteCart)

router.post("/:cid/purchase", passportCall('jwt'), verifyUserCart(), purchaseCart)

router.delete("/test/:cid", deleteTestCart)

export default router