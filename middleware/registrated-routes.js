// My custom route registration middleware

import extractPaths from '../utils/paths-extract.js'

export const registratedRoutes = []

export function extractRoutes(req, res, next) {
    const extractedPaths = []
    registratedRoutes.forEach((crudRoute) => {
        extractedPaths.push(...extractPaths(crudRoute.stack))
    })
    req.extractedPaths = extractedPaths

    next()
}
