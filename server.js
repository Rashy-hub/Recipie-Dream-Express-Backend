import dotenvFlow from 'dotenv-flow'
dotenvFlow.config()
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'

import authRouter from './routes/auth-route.js'
import logRequest from './middleware/request-logger.js'
import { registratedRoutes, extractRoutes } from './middleware/registrated-routes.js'
import errorHandler from './middleware/errors-Handler.js'
import cookieSession from 'cookie-session'
import passport from 'passport'
import configurePassport from './configs/passeport-config.js'

import recipeRouter from './routes/recipe-route.js'

console.clear()
console.log(process.env.NODE_ENV)
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Configure Passport.js
configurePassport(passport)
app.use(passport.initialize())

//extract env variables
const { PORT, NODE_ENV, MONGODB_URI, MONGO_LOCAL, COOKIE_SECRET, ORIGIN_URL } = process.env
const port = PORT

const origin_url = NODE_ENV === 'production' ? ORIGIN_URL : `http://localhost:3000`

const corsOptions = {
    origin: origin_url,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}
app.use(cors(corsOptions))
let mongoURI = null
// Connect to MongoDB
if (NODE_ENV === 'development') {
    mongoURI = MONGO_LOCAL
} else {
    mongoURI = MONGODB_URI
}

mongoose
    .connect(mongoURI)
    .then(() => console.log(`Connected to MongoDB - Connection string :  ${mongoURI}`))
    .catch((err) => console.error('Error connecting to MongoDB:', err))

// Middleware

app.use(
    cookieSession({
        domain: NODE_ENV === 'production' ? '.yagoubi-rachid.me' : 'localhost',
        name: 'session',
        secret: COOKIE_SECRET,
        httpOnly: true,
        secure: NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24, // 24 heures
        sameSite: 'none',
    })
)
app.use(logRequest)
app.use(express.urlencoded({ extended: false }))

// Routes
registratedRoutes.push(recipeRouter)
registratedRoutes.push(authRouter)

// Register my roots for documentation
app.use('/api', ...registratedRoutes)

app.use('*', extractRoutes, (req, res) => {
    const errorMessage = 'Page not found. Available routes  are :'
    const responseBody = {
        error: errorMessage,
        availableRoutes: req.extractedPaths,
    }

    res.status(404).json(responseBody)
})

//Error centralized middleware :
app.use(errorHandler)
app.listen(port, () => {
    console.log(`Server listening http://localhost:${port} - in ${NODE_ENV} environnement`)
})
