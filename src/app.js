import express from "express"
import handlebars from "express-handlebars"

import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import viewsRouter from "./routes/views.router.js"

import { Server } from "socket.io"
import __dirname from "./utils.js"

const PORT = 8080
const app = express()
const httpServer = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))

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
})