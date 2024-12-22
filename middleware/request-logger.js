import logger from '../configs/logger-config.js'
function logRequest(req, res, next) {
    const { method, url } = req
    const startTime = Date.now()

    logger.info(`Incoming request: ${method} ${url}`)

    res.on('finish', () => {
        const statusCode = res.statusCode
        const elapsedTime = Date.now() - startTime
        logger.info(`Request completed: ${method} ${url} - Status: ${statusCode} - Duration: ${elapsedTime}ms`)
    })

    next()
}
export default logRequest
