import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
    console.error("CAUSA DEL ERROR: ", error.cause)
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            res
                .status(400)
                .json({ status: "error", error: error.name, message: error.message, cause: error.cause })
            break
        case EErrors.MISSING_DATA:
            res
                .status(412)
                .json({ status: "error", error: error.name, message: error.message, cause: error.cause })
            break
        default:
            res.status(500).json({ status: "error", error: "Error no contemplado" })
            break
    }
}