import passport from "passport"
import GitHubStrategy from "passport-github2"
import jwt from "passport-jwt"
import local from "passport-local"
import userService from "../dao/models/user.model.js"
import { cartService } from "../repositories/index.js"
import { createHash, isValidPassword } from "../utils.js"
import { getLogger } from "../utils/logger.js"

import config from "./config.js"

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const LocalStrategy = local.Strategy
const logger = getLogger()


const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
            const { first_name, last_name, email, age, role } = req.body
            try {
                let user = await userService.findOne({ email: username })
                if (user) {
                    logger.warning("User already exists")
                    return done(null, false, { messages: "User already exists" })
                }
                const cart = await cartService.addCart()
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role,
                    cart: cart._id,
                    documents: []
                }
                let result = await userService.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error al obtener el usuario: " + error)
            }
        }
    ))

    passport.use("login", new LocalStrategy({ usernameField: "email" }, async (username, password, done) => {
        try {
            if (username === config.adminName && password === config.adminPassword) {
                const adminUser = {
                    first_name: "Usuario",
                    last_name: "Admin",
                    email: config.adminName,
                    age: 1,
                    role: "admin",
                    last_connection: Date.now()
                }
                return done(null, adminUser);
            }
            const user = await userService.findOne({ email: username }).populate("cart")
            if (!user) {
                logger.warning("User doesn´t exist")
                return done(null, false, { messages: "No user found" })
            }
            if (!isValidPassword(user, password)) return done(null, false, { messages: "Incorrect password" })
            delete user.password
            user.last_connection = Date.now()
            await user.save()
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: config.privateKey
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        }
        catch (error) {
            return done(error)
        }
    }
    ))

    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.4e46e84a54b42d24",
        clientSecret: "41066ec3c6c6bea506b36805b0340ff4e9210b62",
        callbackURL: `${config.serverUrl}/api/sessions/githubcallback`
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            logger.debug(`Github profile: ${profile}`)
            let user = await userService.findOne({ email: profile._json.email })
            if (!user) {
                const cart = await cartService.addCart()
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 20,
                    email: profile._json.email,
                    password: '',
                    role,
                    cart: cart._id,
                    documents: []
                }
                let result = await userService.create(newUser);
                done(null, result);
            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        if (user.email === config.adminName) {
            done(null, "admin")
        } else {
            done(null, user._id)
        }
    })

    passport.deserializeUser(async (id, done) => {
        if (id === "admin") {
            const adminUser = {
                first_name: "Usuario",
                last_name: "Admin",
                email: config.adminName,
                age: 1,
                role: "admin"
            }
            done(null, adminUser);
        } else {
            let user = await userService.findById(id)
            done(null, user)
        }
    })
}

const cookieExtractor = (req) => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies[config.cookieToken]
    }
    return token
}

export default initializePassport
