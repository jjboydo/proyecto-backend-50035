import express from "express"
import handlebars from "express-handlebars"
import mongoose from "mongoose"

import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"
import messagesModel from "./dao/models/messages.model.js"

import { Server } from "socket.io"
import __dirname from "./utils.js"

const PORT = 8080
const app = express()
const httpServer = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))

// Conexión a base de datos
mongoose.connect("mongodb+srv://juanjoo1020:QRgbB9YyUalDcDcr@codercluster.bsktuqe.mongodb.net/ecommerce?retryWrites=true&w=majority")
    .then(() => {
        console.log("Conectado a la base de datos")
    })
    .catch(error => {
        console.error("Error al conectarse a la base de datos", error)
    })

// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const socketServer = new Server(httpServer)

// Rutas
app.use('/api/products', productsRouter(socketServer))
app.use('/api/carts', cartsRouter)

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