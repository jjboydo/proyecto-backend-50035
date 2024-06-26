import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import passport from 'passport'
import { dirname } from "path"
import { fileURLToPath } from 'url'
import config from './config/config.js'
import { fakerES as faker } from "@faker-js/faker"
import { productService } from "./repositories/index.js"

const __fliename = fileURLToPath(import.meta.url)
const __dirname = dirname(__fliename)

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

const PRIVATE_KEY = config.privateKey

export const generateToken = (user) => {
    return jwt.sign(user, PRIVATE_KEY, { expiresIn: "1h" })
}

export const validateToken = (token) => {
    return jwt.verify(token, PRIVATE_KEY)
}

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
            req.user = user
            next()
        })(req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "Unauthorized" })
        if (req.user.role != role) return res.status(403).send({ error: "No permissions" })
        next()
    }
}

export const verifyUserCart = () => {
    return async (req, res, next) => {
        const cartId = req.params.cid
        const userCartId = req.user.cartId

        if (cartId !== userCartId) {
            return res.status(403).send({ error: "You do not have permission to modify this cart" })
        }
        next()
    }
}

export const checkOwnership = () => {
    return async (req, res, next) => {
        const productId = req.params.pid
        const product = await productService.getProductsById(productId)

        if (!product) return res.status(404).send({ error: `Product ${productId} does not exist!` })

        if (product.owner !== req.user.email && req.user.role !== "admin") {
            return res.status(403).send({ error: "You do not have permission to modify this product" })
        }
        next()
    }
}

export const checkProductOwner = () => {
    return async (req, res, next) => {
        const userEmail = req.user.email
        const productId = req.params.pid
        const product = await productService.getProductsById(productId)

        if (product.owner === userEmail) {
            return res.status(403).send({ error: "You cannot add your own products to your cart" })
        }

        next()
    }

}

export const generateProduct = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        code: faker.string.alphanumeric(8).toUpperCase(),
        stock: faker.number.int({ min: 1, max: 500 }),
        status: faker.datatype.boolean(0.95),
        category: faker.commerce.department(),
        thumbnails: [faker.image.urlLoremFlickr({ category: 'food' }), faker.image.urlLoremFlickr({ category: 'food' })]
    }
}

export default __dirname