import asyncHandler from 'express-async-handler'
import { decodeJWT } from '../utils/jwt-utils.js'
import { BadRequestErrorResponse, UnauthorizedErrorResponse } from '../utils/error-schemas.js'
import mongoose from 'mongoose'

const authenticateToken = asyncHandler(async (req, res, next) => {
    const token = req.session?.token
    if (!token) {
        next(new UnauthorizedErrorResponse('Access token missing or invalid'))
    }

    const verifiedUserId = await decodeJWT(token)
    req.user = verifiedUserId

    if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
        return next(new BadRequestErrorResponse('Invalid user ID'))
    }

    next()
})

export default authenticateToken
