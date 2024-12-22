export class ErrorResponse extends Error {
    constructor(message, status = 400) {
        super(message)
        this.status = status
        //This way the error name will be the same as the export class name
        this.name = this.constructor.name
    }
}

// 404 Not Found Error
export class NotFoundErrorResponse extends ErrorResponse {
    constructor(message = 'Resource not found') {
        super(message, 404)
    }
}

// 400 Bad Request Error
export class BadRequestErrorResponse extends ErrorResponse {
    constructor(message = 'Bad request') {
        super(message, 400)
    }
}

// 401 Unauthorized Error
export class UnauthorizedErrorResponse extends ErrorResponse {
    constructor(message = 'Unauthorized access', fieldErrors = []) {
        super(message, 401)
        this.fieldErrors = fieldErrors
    }
}

// 403 Forbidden Error
export class ForbiddenErrorResponse extends ErrorResponse {
    constructor(message = 'Access forbidden') {
        super(message, 403)
    }
}

// 422 Unprocessable Entity Error (for validation errors)
export class InvalidFieldErrorResponse extends ErrorResponse {
    constructor(message = 'Invalid fields provided', fieldErrors = []) {
        super(message, 422)
        this.fieldErrors = fieldErrors
    }
}

// 409 Conflict Error (e.g., duplicate data)
export class ConflictErrorResponse extends ErrorResponse {
    constructor(message = 'Conflict: Resource already exists', fieldErrors = []) {
        super(message, 409)
        this.fieldErrors = fieldErrors
    }
}

// 500 Internal Server Error
export class InternalServerErrorResponse extends ErrorResponse {
    constructor(message = 'Internal server error') {
        super(message, 500)
    }
}

// 503 Service Unavailable Error
export class ServiceUnavailableErrorResponse extends ErrorResponse {
    constructor(message = 'Service temporarily unavailable') {
        super(message, 503)
    }
}

// Todo related server error responses

// 400 Invalid todo ID Error
export class InvalidTodoIDResponse extends ErrorResponse {
    constructor(message = 'Invalid todo ID') {
        super(message, 400)
    }
}

export class TodoNotFoundResponse extends ErrorResponse {
    constructor(message = 'Todo not found') {
        super(message, 404)
    }
}
