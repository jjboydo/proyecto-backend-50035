import { fileURLToPath } from 'url'
import { dirname } from "path"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import passport from 'passport'

const __fliename = fileURLToPath(import.meta.url)
const __dirname = dirname(__fliename)

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

const PRIVATE_KEY = "secretCoder"

export const generateToken = (user) => {
    return jwt.sign(user, PRIVATE_KEY, { expiresIn: "24h" })
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

export default __dirname