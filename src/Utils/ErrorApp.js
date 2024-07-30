
export class ErrorApp {
    constructor(message = "Error", statusCode = 404, stack) {
        this.message = message;
        this.statusCode = statusCode;
        this.stack = stack;
    }
}