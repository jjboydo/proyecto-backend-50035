import __dirname from "../utils.js"
import swaggerJSDoc from "swagger-jsdoc"
import path from "path"

const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación del proyecto final E-commerce",
            version: "1.0.0",
            description: "Documentación de la API del proyecto final del curso de backend de Coderhouse",
        }
    },
    apis: [`${path.join(__dirname, "./docs/**/*.yaml")}`]
}

export const specs = swaggerJSDoc(swaggerOptions)
