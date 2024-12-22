import asyncHandler from 'express-async-handler'
import { InvalidFieldErrorResponse } from '../utils/error-schemas.js'

const bodyValidation = (yupValidator, errorCode = 422) => {
    return asyncHandler(async (req, res, next) => {
        try {
            const validatedData = await yupValidator.noUnknown().validate(req.body, { abortEarly: false })

            req.validatedData = validatedData
            next()
        } catch (err) {
            const errors = err.inner.reduce((acc, error) => {
                const { path, message } = error
                if (!acc.hasOwnProperty(path)) {
                    acc[path] = [message]
                } else {
                    acc[path].push(message)
                }
                return acc
            }, {})

            next(new InvalidFieldErrorResponse('Data invalid', errors))
        }
    })
}

export default bodyValidation
