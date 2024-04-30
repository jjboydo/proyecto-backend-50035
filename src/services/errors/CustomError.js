// export default class CustomError {
//     static createError({ name = "Error", cause, message, code = 1 }) {
//         const error = new Error(message)
//         error.name = name
//         error.code = code
//         error.cause = cause
//         throw error
//     }
// }

export default class CustomError extends Error {
    constructor({ name = "Error", cause, message, code = 1 }) {
        super(message)
        this.name = name
        this.cause = cause
        this.code = code

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}