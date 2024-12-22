import bcrypt from 'bcrypt'
import UserModel from '../models/user.js'
import { generateJWT } from '../utils/jwt-utils.js'
import { ConflictErrorResponse, NotFoundErrorResponse, UnauthorizedErrorResponse } from '../utils/error-schemas.js'
import asyncHandler from 'express-async-handler'
import { AuthLoginResponse, AuthRefreshResponse, AuthRegistrationResponse } from '../utils/response-schemas.js'

export const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.validatedData
    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new UserModel({ username, email, password: hashedPassword })
    const existingUser = await UserModel.findOne({ email })

    if (existingUser) {
        throw new ConflictErrorResponse('Email is already in use', [{ user: existingUser }])
    }
    const savedUser = await newUser.save()

    const token = await generateJWT(savedUser._id)

    const response = new AuthRegistrationResponse('User has been registered successfully', savedUser, token.token)

    res.status(response.status).json({
        ...response,
    })
})

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.validatedData

    const user = await UserModel.findOne({ email })
    if (!user) {
        next(new UnauthorizedErrorResponse('Invalid credentials, email not found in the database', [{ field: 'email' }]))
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
        next(new UnauthorizedErrorResponse('Invalid credentials, password not matching', [{ field: 'password' }]))
    }

    const token = await generateJWT(user._id)

    const response = new AuthLoginResponse('User has been logged in successfully', {
        user: user.username,
        id: user._id,
    })

    res.status(response.status).json({
        ...response,
        token: token.token,
    })
})

export const refreshUser = asyncHandler(async (req, res, next) => {
    const userId = req.user.id

    const user = await UserModel.findById(userId)
    if (!user) {
        next(new NotFoundErrorResponse('User not found'))
    }

    const token = await generateJWT(user._id)

    const response = new AuthRefreshResponse('Token has been validated and refreshed successfully', {
        isAuthenticate: true,
    })

    res.status(response.status).json({
        ...response,
        token: token.token,
    })
})

export const logoutUser = asyncHandler(async (req, res) => {
    req.session = null

    console.log('LOGOUT DETECTED')

    const response = {
        status: 200,
        message: 'User has been logged out successfully',
    }

    res.status(response.status).json(response)
})
