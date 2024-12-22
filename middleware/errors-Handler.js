// Centralized errors handler, last middleware, it uses my error predefined schemas

const errorHandler = (err, req, res, next) => {
    // Send back formatted errors to the client or default error 500 server error
    console.log('Sending formatted error as JSON ', err)
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Server Error',
        fieldErrors: err.fieldErrors || undefined,
    })
}

export default errorHandler
