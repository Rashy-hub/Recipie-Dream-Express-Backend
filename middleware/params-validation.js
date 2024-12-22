import asyncHandler from 'express-async-handler'
import { InvalidFieldErrorResponse } from '../utils/error-schemas.js'

const paramsValidation = (yupValidator, errorCode = 422) => {
    return asyncHandler(async (req, res, next) => {
        try {
            const validatedParams = await yupValidator.noUnknown().validate(req.params, { abortEarly: false })

            req.validatedParams = validatedParams
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

            next(new InvalidFieldErrorResponse('Parameters invalid', errors))
        }
    })
}

export default paramsValidation
