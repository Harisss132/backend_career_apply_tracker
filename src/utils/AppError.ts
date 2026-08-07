export class AppError extends Error {
    statusCode: number;
    isOperation: boolean;

    constructor(message: string, statusCode: number = 400) {
        super(message);
        this.statusCode = statusCode;
        this.isOperation = true

        Error.captureStackTrace(this, this.constructor)
    }
}