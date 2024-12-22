// Success Responses
export class SuccessResponse {
    constructor(message, data = {}, status = 200) {
        this.status = status
        this.success = true
        this.message = message
        this.data = data
    }
}

// ! My Todos related responses from here
export class TodoListResponse extends SuccessResponse {
    constructor(message, todos) {
        super(message, { todos })
    }
}

export class TodoCreatedResponse extends SuccessResponse {
    constructor(message, todo) {
        super(message, { todo }, 201)
    }
}

// ! Todos related responses end here

// ! Auth related responses start from here
export class AuthSuccessResponse extends SuccessResponse {
    constructor(message, data) {
        super(message, data, 200)
    }
}

export class AuthRegistrationResponse extends SuccessResponse {
    constructor(message, user, token) {
        super(message, { user, token }, 201)
    }
}

export class AuthLoginResponse extends SuccessResponse {
    constructor(message, user, token) {
        super(message, { user, token }, 200)
    }
}
export class AuthRefreshResponse extends SuccessResponse {
    constructor(message, token) {
        super(message, { token }, 200)
    }
}
// ! Auth related responses end here
