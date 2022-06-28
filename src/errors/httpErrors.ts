import HttpStatusCode from "./httpStatusCode";

class HttpError extends Error {
    status: HttpStatusCode;
    message: string;
    constructor(status: HttpStatusCode, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

class LoginFailedError extends HttpError {
    constructor(){
        super(HttpStatusCode.UNAUTHORIZED, "Your username or password is incorrect")
    }
}

class JwtMissingError extends HttpError {
    constructor() {
        super(HttpStatusCode.UNAUTHORIZED, "JWT Token missing");
    }
}

class OrderAlreadyStartedError extends HttpError {
    constructor(){
        super(HttpStatusCode.BAD_REQUEST, "Order has been already started.")
    }
}

class OrderNotFoundError extends HttpError {
    constructor(){
        super(HttpStatusCode.NOT_FOUND, "Order not found");
    }
}

class ParameterNotValidError extends HttpError {
    constructor() {
        super(HttpStatusCode.BAD_REQUEST, "One or more required parameters are missing or not valid");
    }
}

class QuantitiesDoNotMatchError extends HttpError {
    constructor() {
        super(HttpStatusCode.BAD_REQUEST, "Quantity inserted do not match");
    }
    
}

class UnauthorizedError extends HttpError {
    constructor() {
        super(HttpStatusCode.UNAUTHORIZED, "You don't have rights to do this action");
    }
}

class UserAlreadyExistsError extends HttpError {
    constructor(){
        super(HttpStatusCode.BAD_REQUEST, "User already exists");
    }
}

class UserNotFound extends HttpError {
    constructor(){
        super(HttpStatusCode.NOT_FOUND, "User not found");
    }
}

class InternalServerError extends HttpError {
    constructor() {
        super(HttpStatusCode.INTERNAL_SERVER_ERROR, "An error has occured");
    }
}

export enum ErrorEnum {
    LOGIN_FAILED,
    JWT_MISSING,
    ORDER_ALREADY_STARTED,
    ORDER_NOT_FOUND,
    PARAM_NOT_VALID,
    QUANTITIES_DO_NOT_MATCH,
    USER_ALREADY_EXISTS,
    USER_NOT_FOUND,
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR
}

export class ErrorFactory {
    getError(type: ErrorEnum): HttpError {
        let error: HttpError = new InternalServerError();
        switch (type) {
            case ErrorEnum.LOGIN_FAILED:
                error = new LoginFailedError();
                break;
            case ErrorEnum.JWT_MISSING:
                error = new JwtMissingError();
                break;
            case ErrorEnum.ORDER_ALREADY_STARTED:
                error = new OrderAlreadyStartedError();
                break;
            case ErrorEnum.ORDER_NOT_FOUND:
                error = new OrderNotFoundError();
                break;
            case ErrorEnum.PARAM_NOT_VALID:
                error = new ParameterNotValidError();
                break;
            case ErrorEnum.QUANTITIES_DO_NOT_MATCH:
                error = new QuantitiesDoNotMatchError();
                break;
            case ErrorEnum.UNAUTHORIZED:
                error = new UnauthorizedError();
                break;
            case ErrorEnum.USER_ALREADY_EXISTS:
                error = new UserAlreadyExistsError();
                break;
            case ErrorEnum.USER_NOT_FOUND:
                error = new UserNotFound();
                break;
        }
        return error;
    }
}