import jwt from 'jsonwebtoken'
import { BadRequestErrorResponse, UnauthorizedErrorResponse, InternalServerErrorResponse } from './error-schemas.js'

// Generate JWT with minimal payload (user ID only)
const generateJWT = async (userId) => {
    if (!userId) {
        throw new BadRequestErrorResponse('User ID is required to generate a JWT')
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new InternalServerErrorResponse('JWT secret not defined in environment')
    }

    const options = {
        algorithm: 'HS512',
        audience: process.env.JWT_AUDIENCE || 'default_audience',
        issuer: process.env.JWT_ISSUER || 'default_issuer',
        expiresIn: '1h', // Expiration définie ici
    }

    try {
        const token = jwt.sign({ id: userId }, secret, options)
        return { token }
    } catch (error) {
        throw new InternalServerErrorResponse(`Token generation error: ${error.message}`)
    }
}

const decodeJWT = async (token) => {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new InternalServerErrorResponse('JWT secret not defined in environment')
    }

    try {
        const data = jwt.verify(token, secret)
        return { id: data.id }
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new UnauthorizedErrorResponse('JWT expired, please refresh your token')
        } else {
            throw new UnauthorizedErrorResponse('Invalid JWT')
        }
    }
}

export { generateJWT, decodeJWT }
