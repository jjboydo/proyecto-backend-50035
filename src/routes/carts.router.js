import express from "express"
import { addCart, getCartById, addProductToCart, deleteProductFromCart, updateCart, updateProductFromCart, deleteCart } from "../controllers/cartsController.js"

const router = express.Router()

// ENDPOINTS

router.post("/", addCart)

router.get("/:cid", getCartById)

router.post("/:cid/product/:pid", addProductToCart)

router.delete("/:cid/product/:pid", deleteProductFromCart)

router.put("/:cid", updateCart)

router.put("/:cid/product/:pid", updateProductFromCart)

router.delete("/:cid", deleteCart)

export default router