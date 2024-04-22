import express from "express"
import { getCarts, getChat, getHome, getLogin, getLogout, getProducts, getProfile, getRealTimeProducts, getRegister } from "../controllers/viewsController.js"
import { authorization, passportCall } from "../utils.js"

const router = express.Router()

// VISTAS

router.get("/", getHome)

router.get("/realtimeproducts", getRealTimeProducts)

router.get("/chat", passportCall('jwt'), authorization("user"), getChat)

router.get("/products", getProducts)

router.get("/carts/:cid", getCarts)

// VISTAS DE LOGIN

router.get("/login", getLogin)

router.get("/register", getRegister)

router.get("/profile", getProfile)

router.get('/logout', getLogout)

export default router