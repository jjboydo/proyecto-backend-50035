import UserDTO from "../dao/DTOs/user.dto.js"
import MailingService from "../services/mailing.js"
import config from "../config/config.js"
import { userService } from "../repositories/index.js"

export const changeRole = async (req, res, next) => {
    try {
        const user = await userService.changeRole(req.params.uid)
        res.status(200).send({ status: "success", payload: new UserDTO(user) })
    } catch (error) {
        next(error)
    }
}

export const uploadDocument = async (req, res, next) => {
    try {
        const user = await userService.uploadDocument(req.params.uid, req.files)
        res.status(200).send({ status: "success", payload: user.documents })
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        const usersDTO = users.map(user => new UserDTO(user));
        res.status(200).send({ status: "success", payload: usersDTO })
    } catch (error) {
        res.status(500).send('Error getting users')
    }
}

export const deleteInactiveUsers = async (req, res) => {
    try {
        const users = await userService.deleteInactiveUsers()
        res.status(200).send({ status: "success", payload: users })
    } catch (error) {
        console.log(error)
        res.status(500).send('Error deleting inactive users')
    }
}