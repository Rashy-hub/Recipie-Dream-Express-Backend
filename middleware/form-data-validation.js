import asyncHandler from 'express-async-handler'
import { InvalidFieldErrorResponse } from '../utils/error-schemas.js'

const bodyWithFilesValidation = (yupBodyValidator, yupFilesValidator, errorCode = 422) => {
    return asyncHandler(async (req, res, next) => {
        try {
            console.log(JSON.stringify(req.body, null, 2))

            const bodyData = await yupBodyValidator.noUnknown().validate(req.body, { abortEarly: false })

            const files = {
                coverPicture: req.files.coverPicture || null,
            }

            req.validatedData = bodyData
            req.validatedFiles = files

            next()
        } catch (err) {
            const errors = err.inner.reduce((acc, error) => {
                const { path, message } = error
                if (!acc[path]) {
                    acc[path] = [message]
                } else {
                    acc[path].push(message)
                }
                return acc
            }, {})

            res.status(errorCode).json(new InvalidFieldErrorResponse('Body data invalid', errors, errorCode))
        }
    })
}

export default bodyWithFilesValidation
