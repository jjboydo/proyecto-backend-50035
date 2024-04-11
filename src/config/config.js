import dotenv from "dotenv"

dotenv.config({ path: "./.env" })

export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    mongoUrlSessions: process.env.MONGO_URL_SESSIONS,
    adminName: process.env.ADMIN_NAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    privateKey: process.env.PRIVATE_KEY,
    cookieToken: process.env.TOKEN_COOKIE
}