import MongoStore from "connect-mongo"
import cookieParser from "cookie-parser"
import express from "express"
import handlebars from "express-handlebars"
import session from "express-session"
import mongoose from "mongoose"
import passport from "passport"
import config from "./config/config.js"
import initializePassport from "./config/passport.config.js"

import cartsRouter from "./routes/carts.router.js"
import productsRouter from "./routes/products.router.js"
import sessionsRouter from "./routes/sessions.router.js"
import viewsRouter from "./routes/views.router.js"

import errorHandler from "./middlewares/errors/index.js"
import { addLogger } from "./utils/logger.js"

import messagesModel from "./dao/models/messages.model.js"
import { getLogger } from "./utils/logger.js"

import { Server } from "socket.io"
import __dirname from "./utils.js"

const PORT = config.port
const app = express()
const logger = getLogger()
const httpServer = app.listen(PORT, () => logger.info(`Servidor corriendo en el puerto ${PORT}`))
app.use(addLogger)

// Conexión a base de datos
mongoose.connect(config.mongoUrl)
    .then(() => {
        logger.info("Conectado a la base de datos")
    })
    .catch(error => {
        logger.fatal("Error al conectarse a la base de datos", error)
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

// Prueba de logs

app.get('/loggerTest', (req, res) => {
    req.logger.fatal('fatal');
    req.logger.error('error');
    req.logger.warning('warning');
    req.logger.info('info');
    req.logger.debug('debug');
    res.send('Logs sent to console');
})


socketServer.on("connection", socket => {
    logger.info("Nuevo cliente conectado")

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

app.use(errorHandler)