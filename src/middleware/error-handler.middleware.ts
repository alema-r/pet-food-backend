import express from "express";
import { ErrorEnum, ErrorFactory } from "../errors/httpErrors";

let errorFactory = new ErrorFactory();

/**
 * Middleware that handles error. It uses the errorFactory if the error is defined in {@linkcode ErrorEnum}, otherwise it returns
 * an error with status 500 and the error message.
 * @param err the error passed to the middleware
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 */
export function errorHandler(err: ErrorEnum | any, req: express.Request, res: express.Response, next: express.NextFunction) {
    if(err in ErrorEnum){
        const error = errorFactory.getError(err);
        return res.status(error.status).json({ error: error.message });
    }
    else {
        return res.status(500).json({ error: err });
    }
}