import config from "../config/config.js"
import UserDTO from "../dao/DTOs/user.dto.js"
import { createHash, generateToken, isValidPassword, validateToken } from "../utils.js"
import MailingService from "../services/mailing.js"
import { userService } from "../repositories/index.js"


export const register = async (req, res) => {
    req.logger.info('User registered')
    res.send({ status: "success", payload: req.user._id })
}

export const failRegister = async (req, res) => {
    req.logger.error('Failed register')
    res.send({ error: "Failed register" })
}

export const login = async (req, res) => {
    const { email, password } = req.body
    let tokenUser
    if (!email || !password) {
        req.logger.error('Missing data')
        return res.status(400).send({ status: "error", error: "Missing data" });
    }
    if (email === config.adminName && password === config.adminPassword) {
        tokenUser = {
            first_name: "Usuario",
            last_name: "Admin",
            email: config.adminName,
            age: 1,
            role: "admin"
        }
        // req.session.admin = true
    } else {
        tokenUser = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            cartId: req.user.cart._id,
            role: req.user.role
        }
        // req.session.admin = false
    }
    const token = generateToken(tokenUser)
    res.cookie(config.cookieToken, token, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ message: "Logged in!" })
}

export const failLogin = async (req, res) => {
    req.logger.error('Failed login')
    res.send({ error: 'Failed login' })
}

export const githubCallback = async (req, res) => {
    const tokenUser = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        cartId: req.user.cart._id,
        role: "user"
    }
    const token = generateToken(tokenUser)
    req.logger.info(token)
    res.cookie(config.cookieToken, token, { maxAge: 60 * 60 * 1000, httpOnly: true }).send({ message: "Logged in!" })
}

export const current = (req, res) => {
    let user = new UserDTO(req.user)
    res.send(user);
}

export const recoverPassword = async (req, res) => {
    const { email } = req.body
    const user = await userService.getUserByEmail(email)
    if (!user) {
        return res.status(404).send({ status: "error", message: 'User not found' })
    }

    const tokenUser = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        cartId: user.cart._id,
        role: user.role
    }

    const token = generateToken(tokenUser)

    const mailer = new MailingService()

    const mailOptions = {
        from: config.email,
        to: user.email,
        subject: "Recuperar contraseña",
        html: `<p>Haga click en el siguiente enlace para recuperar la contraseña: </p>
        <a href="${config.frontendUrl}/api/sessions/reset-password/${token}">Recuperar contraseña</a>`
    }

    await mailer.sendMail(mailOptions)

    res.status(200).send({ status: "success", message: 'Email sent' })
}

export const recoverTokenPassword = async (req, res) => {
    try {
        const token = req.params.token
        const decoded = validateToken(token)

        if (!decoded) {
            res.redirect('/recover-password')
        }

        res.redirect(`/reset-password/${token}`)
    } catch (error) {
        req.logger.error('Error recovering password')
        res.redirect('/recover-password')
    }
}

export const updatePassword = async (req, res) => {
    const { password } = req.body
    const token = req.params.token
    const decoded = validateToken(token)

    const user = await userService.getUserByEmail(decoded.email)

    if (!user) {
        return res.status(404).send('User not found');
    }

    if (isValidPassword(user, password)) {
        return res.status(400).send({ status: "error", message: 'The new password must be different from the previous one' });
    }

    const hashedPassword = createHash(password)

    user.password = hashedPassword;

    await user.save();

    res.status(200).send({ status: "success", message: 'Password updated' });
}

export const deleteUser = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id)

        if (!user) {
            return res.status(404).send('User not found')
        }

        await userService.deleteUserById(user._id)
        res.status(200).send("User deleted")
    } catch (error) {
        res.status(500).send('Error deleting user')
    }
}