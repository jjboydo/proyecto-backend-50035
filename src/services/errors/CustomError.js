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