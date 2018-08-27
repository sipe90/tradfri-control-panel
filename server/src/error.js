class ValidationError extends Error {
    constructor(message, field, status) {
        super()
        Error.captureStackTrace(this, this.constructor)

        this.name = this.constructor.name
        this.message = message || 'Bad request'
        this.field = field
        this.status = status || 400
    }
}

module.exports = {
    ValidationError
}
