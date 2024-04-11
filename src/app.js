import express from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"
import MongoStore from "connect-mongo"
import session from "express-session"
import passport from "passport"
import initializePassport from "./config/passport.config.js"
import cookieParser from "cookie-parser"
import config from "./config/config.js"

import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import sessionsRouter from "./routes/sessions.router.js"

import messagesModel from "./dao/models/messages.model.js"

import { Server } from "socket.io"
import __dirname, { authorization, passportCall } from "./utils.js"

const PORT = config.port
const app = express()
const httpServer = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))

// Conexión a base de datos
mongoose.connect(config.mongoUrl)
    .then(() => {
        console.log("Conectado a la base de datos")
    })
    .catch(error => {
        console.error("Error al conectarse a la base de datos", error)
    })

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

const socketServer = new Server(httpServer)

// Sessions

app.use(session({
    store: MongoStore.create({
        mongoUrl: config.mongoUrlSessions,
        ttl: 150
    }),
    secret: config.privateKey,
    resave: false,
    saveUninitialized: false
}))
initializePassport()
app.use(passport.initialize())
app.use(passport.session())

// Rutas
app.use('/api/products', productsRouter(socketServer))
app.use('/api/carts', cartsRouter)
app.use('/api/sessions', sessionsRouter)


// Handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")
app.use(express.static(__dirname + "/public"))
app.use("/", viewsRouter)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado")

    socket.on('message', async (data) => {
        await messagesModel.create({ user: data.user, message: data.message })
        const messages = await messagesModel.find()
        socketServer.emit('messageLogs', messages)
    })

    socket.on('showMessages', async () => {
        const messages = await messagesModel.find()
        socketServer.emit('messageLogs', messages)
    })
})