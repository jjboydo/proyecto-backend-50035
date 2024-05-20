import mailer from "nodemailer"
import config from "../config/config.js"

export default class MailingService {
    constructor() {
        this.transporter = mailer.createTransport({
            service: config.emailService,
            host: config.emailHost,
            port: 587,
            secure: false,
            auth: {
                user: config.email,
                pass: config.emailPassword
            }
        })
    }

    sendMail = async ({ from, to, subject, html, attachments = [] }) => {
        const mailOptions = {
            from: config.email,
            to,
            subject,
            html,
            attachments
        }
        try {
            await this.transporter.sendMail(mailOptions)
        } catch (error) {
            console.error(error)
        }
    }
}