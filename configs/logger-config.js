import winston from 'winston'
import path from 'path'
import fs from 'fs'

import dotenvFlow from 'dotenv-flow'
import { fileURLToPath } from 'url'
dotenvFlow.config()

const logLevel = process.env.LOG_LEVEL || 'info'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logDir = path.join(__dirname, '../logs')
console.log(logDir)
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const myLogger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    ),
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: path.join(logDir, 'combined.log') })],
})

export default myLogger
