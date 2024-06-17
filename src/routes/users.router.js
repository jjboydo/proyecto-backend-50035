import express from "express"
import { changeRole, uploadDocument } from "../controllers/usersController.js"
import applyPolicy from "../middlewares/auth.middleware.js"
import { passportCall } from "../utils.js"
import { uploader } from "../utils/multer.js"

const router = express.Router()

// ENDPOINTS

router.put('/premium/:uid', passportCall('jwt'), applyPolicy(["USER", "USER_PREMIUM"]), changeRole)

router.post('/:uid/documents', passportCall('jwt'), applyPolicy(["USER", "USER_PREMIUM"]), uploader.fields([
    { name: 'profileImage', },
    { name: 'productImage' },
    { name: 'other' },
    { name: 'identification' },
    { name: 'proofOfAddress' },
    { name: 'proofOfAccountStatus' },
]), uploadDocument)

export default router