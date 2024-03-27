import passport from "passport"
import local from "passport-local"
import userService from "../dao/models/user.model.js"
import { createHash, isValidPassword } from "../utils.js"
import GitHubStrategy from "passport-github2"
import jwt from "passport-jwt"
import CartManager from "../dao/mongoose/CartManager.js"

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt
const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" }, async (req, username, password, done) => {
            const { first_name, last_name, email, age, role } = req.body
            try {
                let user = await userService.findOne({ email: username })
                if (user) {
                    console.log("User already exists")
                    return done(null, false, { messages: "User already exists" })
                }
                const cartManager = new CartManager()
                const cart = await cartManager.addCart()
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role,
                    cart: cart._id
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
            if (username === "adminCoder@coder.com" && password === "adminCod3r123") {
                const adminUser = {
                    first_name: "Usuario",
                    last_name: "Admin",
                    email: "adminCoder@coder.com",
                    age: 1,
                    role: "admin"
                }
                return done(null, adminUser);
            }
            const user = await userService.findOne({ email: username }).populate("cart")
            if (!user) {
                console.log("User doesn´t exist")
                return done(null, false, { messages: "No user found" })
            }
            if (!isValidPassword(user, password)) return done(null, false, { messages: "Incorrect password" })
            delete user.password
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: jwt.ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: 'secretCoder'
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
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await userService.findOne({ email: profile._json.email })
            if (!user) {
                const cartManager = new CartManager()
                const cart = await cartManager.addCart()
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 20,
                    email: profile._json.email,
                    password: '',
                    cart: cart._id
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
        if (user.email === "adminCoder@coder.com") {
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
                email: "adminCoder@coder.com",
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
        token = req.cookies['cookieToken']
    }
    return token
}

export default initializePassport
