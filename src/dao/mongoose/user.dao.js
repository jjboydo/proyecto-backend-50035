import usersModel from "../models/user.model.js";

export default class UserDAO {
    async getUserById(userId) {
        return await usersModel.findById(userId);
    }

    async deleteUserById(userId) {
        return await usersModel.deleteOne({ _id: userId });
    }

    async getUsers() {
        return await usersModel.find();
    }

    async getInactiveUsers() {
        return await usersModel.find({ last_connection: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }, role: { $ne: 'admin' } });
    }

    async deleteInactiveUsers() {
        return await usersModel.deleteMany({ last_connection: { $lt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }, role: { $ne: 'admin' } });
    }

    async getUserByEmail(email) {
        return await usersModel.findOne({ email: email });
    }
}