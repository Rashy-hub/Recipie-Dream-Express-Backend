import asyncHandler from 'express-async-handler'
import multer from 'multer'
import multerStorageOptions from '../utils/multer-utils.js'

const multerMiddleware = (options = { fields: [] }) => {
    const upload = multer(multerStorageOptions(options))
    return asyncHandler((req, res, next) => {
        upload.fields(options.fields)(req, res, next)
    })
}

export default multerMiddleware
