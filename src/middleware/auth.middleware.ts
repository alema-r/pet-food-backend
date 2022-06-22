import express from "express";
import { Role, User } from "../models/users";
import { verify } from "jsonwebtoken";
import { ErrorEnum } from "../errors/httpErrors";
import { Order } from "../models/orders";

/**
 * Middleware to check and verify JWT tokens
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 * @returns 
 */
export async function checkAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        let authHeader = req.headers.authorization;
        if (!authHeader) {
            return next(ErrorEnum.JWT_MISSING);
        }
        // Deletes "bearer"
        const jwt = authHeader.split(' ')[1];
        // verifies if token is valid
        verify(jwt, process.env.JWT_SECRET, function (err, decoded) {
            if (err) {
                // token not valid, send the error to the error handler middleware
                return next(err);
            }
            // token is valid
            if (typeof (decoded) === "string") {
                req.user = JSON.parse(decoded);
            }
            else {
                req.user = decoded!;
            }
        });

        next();
    } catch (error) {
        next(error);
    }
}

/**
 * Middleware that checks if user has privileges to perform some action. In case of multiple values, privileges are checked with an OR logic.
 * @param privilegeNeeded array of `Role` to specify which privileges are needed.
 */
export const checkPrivileges = (privilegeNeeded: Role[]) => async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (privilegeNeeded.some((elem) => elem === req.user.role)) {
        next();
    }
    else {
        next(ErrorEnum.UNAUTHORIZED);
    }
}

/**
 * Middleware that checks if the order specified belongs to the user. If the user is an admin, the check is successful
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 */
export async function hasAccessToOrder(req: express.Request, res: express.Response, next: express.NextFunction) {
    const order = await Order.findOne({ where: { uuid: req.params.uuid } });
    if (!order) {
        return next(ErrorEnum.ORDER_NOT_FOUND);
    }
    if (order.userId === req.user.id || req.user.role === Role.ADMIN) {
        next()
    }
    else {
        next(ErrorEnum.UNAUTHORIZED);
    }
}