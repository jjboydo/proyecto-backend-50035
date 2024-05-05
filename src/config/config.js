import dotenv from "dotenv"
import { Command } from "commander"

const program = new Command()

program
    .option("--mode <mode>", "modo de ejecución", "PRODUCTION")

program.parse(process.argv)

const options = program.opts()
const environment = options.mode.toUpperCase()

dotenv.config({ path: environment === "PRODUCTION" ? "./.env" : "./.env.dev" })


export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoUrlSessions: process.env.MONGO_URL_SESSIONS,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    privateKey: process.env.PRIVATE_KEY,
    cookieToken: process.env.TOKEN_COOKIE,
    mode: process.env.MODE
}