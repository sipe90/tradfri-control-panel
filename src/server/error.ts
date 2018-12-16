
export class ValidationError extends Error {

    field: string;
    status: number;

    constructor(field: string, message?: string, status = 400) {
        super()
        Error.captureStackTrace(this, this.constructor)

        this.name = 'ValidationError'
        this.field = field
        this.message = message || 'Bad request'
        this.status = status
    }
}
