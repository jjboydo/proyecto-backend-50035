import config from "../config/config.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import MailingService from "../services/mailing.js";
import { getLogger } from "../utils/logger.js";

const logger = getLogger();

export default class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async getUserByEmail(email) {
        try {
            return await this.dao.getUserByEmail(email);
        } catch (error) {
            logger.error("Error getting user by email: ");
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            return await this.dao.getUserById(userId);
        } catch (error) {
            logger.error("Error getting user by id: ");
            throw error;
        }
    }

    async deleteUserById(userId) {
        try {
            return await this.dao.deleteUserById(userId);
        } catch (error) {
            logger.error("Error deleting user by id: ");
            throw error;
        }
    }

    async changeRole(userId) {
        try {
            const user = await this.dao.getUserById(userId);

            if (!user) {
                throw new CustomError({
                    name: `Role Error`,
                    cause: `User with id ${userId} not found`,
                    message: 'Error changing role',
                    code: EErrors.NOT_FOUND
                })
            }

            if (user.role === 'user' && (!user.documents.some(doc => doc.name === 'identification') ||
                !user.documents.some(doc => doc.name === 'proofOfAddress') ||
                !user.documents.some(doc => doc.name === 'proofOfAccountStatus'))) {
                throw new CustomError({
                    name: `Role Error`,
                    cause: `User with id ${userId} does not have all required documents`,
                    message: 'Error changing role',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            user.role = user.role === 'user' ? 'user_premium' : 'user';
            return await user.save();
        } catch (error) {
            logger.error("Error changing role: ");
            throw error;
        }
    }

    async uploadDocument(userId, files) {
        try {
            const user = await this.dao.getUserById(userId);

            if (!user) {
                throw new CustomError({
                    name: `Document Error`,
                    cause: `User with id ${userId} not found`,
                    message: 'Error uploading document',
                    code: EErrors.NOT_FOUND
                })
            }

            if (!files) {
                throw new CustomError({
                    name: `Document Error`,
                    cause: `No files uploaded`,
                    message: 'Error uploading document',
                    code: EErrors.INVALID_TYPES_ERROR
                })
            }

            // Manejo de documentos
            if (files.identification || files.proofOfAddress || files.proofOfAccountStatus || files.other) {
                const documents = [
                    { name: 'identification', files: files.identification },
                    { name: 'proofOfAddress', files: files.proofOfAddress },
                    { name: 'proofOfAccountStatus', files: files.proofOfAccountStatus },
                    { name: 'other', files: files.other },
                ]

                documents.forEach(doc => {
                    if (doc.files) {
                        doc.files.forEach(file => {
                            const documentData = {
                                name: file.fieldname,
                                reference: "/uploads/documents/" + file.filename,
                            }
                            user.documents.push(documentData)
                        })
                    }
                })
            }

            // Manejo de imagenes de perfil
            if (files.profileImage) {
                const profileImage = files.profileImage

                profileImage.forEach(image => {
                    const imageData = {
                        name: image.fieldname,
                        reference: "/public/uploads/profiles/" + image.filename,
                    }
                    user.documents.push(imageData)
                })
            }

            // Manejo de imagenes de productos
            if (files.productImage) {
                const productImage = files.productImage

                productImage.forEach(image => {
                    const imageData = {
                        name: image.fieldname,
                        reference: "/public/uploads/products/" + image.filename,
                    }
                    user.documents.push(imageData)
                })
            }

            return await user.save();
        } catch (error) {
            logger.error("Error uploading document: ");
            throw error;
        }
    }

    async getUsers() {
        try {
            return await this.dao.getUsers();
        } catch (error) {
            logger.error("Error getting users: ");
            throw error;
        }
    }

    async deleteInactiveUsers() {
        try {
            const users = await this.dao.getInactiveUsers();
            await this.dao.deleteInactiveUsers();

            const mailer = new MailingService();

            users.forEach(user => {
                const mailOptions = {
                    from: config.email,
                    to: user.email,
                    subject: "Cuenta inactiva",
                    html: `<h2>Su cuenta ha sido eliminada del sistema por inactividad.</h2>`
                }

                mailer.sendMail(mailOptions);
            });

            return users;
        } catch (error) {
            logger.error("Error deleting inactive users: ");
            throw error;
        }
    }
}
