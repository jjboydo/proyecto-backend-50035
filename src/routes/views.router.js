import express from "express"
import { getCarts, getChat, getHome, getLogin, getLogout, getProducts, getProfile, getRealTimeProducts, getRecoverPassword, getRegister, getResetPassword } from "../controllers/viewsController.js"
import applyPolicy from "../middlewares/auth.middleware.js"
import { passportCall, verifyUserCart } from "../utils.js"

const router = express.Router()

// VISTAS

router.get("/", getHome)

router.get("/realtimeproducts", getRealTimeProducts)

router.get("/chat", passportCall('jwt'), applyPolicy(["USER"]), getChat)

router.get("/products", passportCall('jwt'), getProducts)

router.get("/carts/:cid", passportCall('jwt'), verifyUserCart(), getCarts)

// VISTAS DE LOGIN

router.get("/login", getLogin)

router.get("/register", getRegister)

router.get("/profile", getProfile)

router.get('/logout', getLogout)

router.get('/reset-password/:token', getResetPassword)

router.get('/recover-password', getRecoverPassword)

export default router