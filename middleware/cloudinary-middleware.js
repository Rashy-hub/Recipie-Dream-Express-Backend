import asyncHandler from 'express-async-handler'
import { uploadToCloudinary } from '../utils/cloudinary-utils.js'

const cloudinaryMiddleware = (options = { resourceType: 'auto', folderPath: '' }) => {
    return asyncHandler(async (req, res, next) => {
        if (!req.files) {
            console.log('cloudinaryMiddleware: no file to process, multer did something wrong')
            return next()
        }

        const userId = req.user?.id

        if (!userId) {
            return res.status(400).send('User ID is required')
        }

        const fileUploads = Object.entries(req.files).flatMap(([fieldname, files]) =>
            files.map((file) => {
                let publicId = `${fieldname}_${userId}`
                const fileType = file.mimetype
                const resourceType = fileType === 'application/pdf' ? 'raw' : 'image'

                if (fileType === 'application/pdf') {
                    publicId += '.pdf'
                }

                return uploadToCloudinary(resourceType, options.folderPath, file.buffer, publicId)
                    .then((result) => ({ fieldname, result }))
                    .catch((error) => ({ fieldname, error }))
            })
        )

        const uploadResults = await Promise.all(fileUploads)
        req.uploadResults = uploadResults
        next()
    })
}

export default cloudinaryMiddleware
