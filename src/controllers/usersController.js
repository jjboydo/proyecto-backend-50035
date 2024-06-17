import userService from "../dao/models/user.model.js"

export const changeRole = async (req, res) => {
    try {
        const user = await userService.findById(req.params.uid)

        if (!user) {
            return res.status(404).send('User not found')
        }

        if (user.role === 'user' && (!user.documents.some(doc => doc.name === 'identification') ||
            !user.documents.some(doc => doc.name === 'proofOfAddress') ||
            !user.documents.some(doc => doc.name === 'proofOfAccountStatus'))) {
            return res.status(400).send({ status: "error", message: 'You must upload the required documents' })
        }

        user.role = user.role === 'user' ? 'user_premium' : 'user'
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send('Error changing role')
    }
}

export const uploadDocument = async (req, res) => {
    try {
        const user = await userService.findById(req.params.uid)

        if (!user) {
            return res.status(404).send('User not found')
        }

        if (!req.files) {
            return res.status(400).send('No files uploaded')
        }

        // Manejo de documentos
        if (req.files.identification || req.files.proofOfAddress || req.files.proofOfAccountStatus || req.files.other) {
            const documents = [
                { name: 'identification', files: req.files.identification },
                { name: 'proofOfAddress', files: req.files.proofOfAddress },
                { name: 'proofOfAccountStatus', files: req.files.proofOfAccountStatus },
                { name: 'other', files: req.files.other },
            ]

            documents.forEach(doc => {
                if (doc.files) {
                    doc.files.forEach(file => {
                        const documentData = {
                            name: file.fieldname,
                            reference: "/public/uploads/documents/" + file.filename,
                        }
                        user.documents.push(documentData)
                    })
                }
            })

        }

        // Manejo de imagenes de perfil
        if (req.files.profileImage) {
            const profileImage = req.files.profileImage

            profileImage.forEach(image => {
                const imageData = {
                    name: image.fieldname,
                    reference: "/public/uploads/profiles/" + image.filename,
                }
                user.documents.push(imageData)
            })
        }

        // Manejo de imagenes de productos
        if (req.files.productImage) {
            const productImage = req.files.productImage

            productImage.forEach(image => {
                const imageData = {
                    name: image.fieldname,
                    reference: "/public/uploads/products/" + image.filename,
                }
                user.documents.push(imageData)
            })
        }

        await user.save()

        res.status(200).send({ status: "success", payload: user.documents })
    } catch (error) {
        res.status(500).send('Error uploading document')
    }
}