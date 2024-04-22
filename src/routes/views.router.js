import express from "express"
import { getCarts, getChat, getHome, getLogin, getLogout, getProducts, getProfile, getRealTimeProducts, getRegister } from "../controllers/viewsController.js"
import { authorization, passportCall, verifyUserCart } from "../utils.js"

const router = express.Router()

// VISTAS

router.get("/", getHome)

router.get("/realtimeproducts", getRealTimeProducts)

router.get("/chat", passportCall('jwt'), authorization("user"), getChat)

router.get("/products", passportCall('jwt'), getProducts)

router.get("/carts/:cid", passportCall('jwt'), verifyUserCart(), getCarts)

// VISTAS DE LOGIN

router.get("/login", getLogin)

router.get("/register", getRegister)

router.get("/profile", getProfile)

router.get('/logout', getLogout)

export default router