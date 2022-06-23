import express from "express";
import { hash, compare } from "bcrypt";
import { Role, User } from "../models/users";
import { JwtPayload, sign } from "jsonwebtoken";
import { ErrorEnum } from "../errors/httpErrors";
import { UserCreateModel } from "../util/parametersInterface";

/**
 * Function that creates a User. Params are taken from the body of the request
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 * @returns A response with a message of success or an error.
 */
export async function register(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const userModel: UserCreateModel = { username: req.body.username, password: req.body.password, role: Role.USER };
        const searchForDup: User | null = await User.findOne({ where: { username: userModel.username } });
        if (searchForDup !== null) {
            return next(ErrorEnum.USER_ALREADY_EXISTS);
        }
        await hash(userModel.password, 10).then(function (hash) {
            userModel.password = hash;
        });

        await User.create(userModel);
        return res.status(201).json({ message: "User correctly created" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

/**
 * Login the user with username and password provided by the body of the request.
 * @param req express.Request
 * @param res express.Response
 * @param next express.NextFunction
 * @returns A response with the jwt or an error message in case of failure.
 */
export async function login(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const username: string = req.body.username;
        const password: string = req.body.password;
        const dbUser: User | null = await User.findOne({ where: { username: username } });
        if (dbUser === null) {
            return next(ErrorEnum.USER_NOT_FOUND);
        }
        const checkPassword = await compare(password, dbUser.password);
        if (!checkPassword) {
            return next(ErrorEnum.LOGIN_FAILED);
        }
        const payload: JwtPayload = { id: dbUser.id, username: dbUser.username, role: dbUser.role };
        const jwtToken: string = sign(payload, process.env.JWT_SECRET);
        
        return res.json({ token: jwtToken });
    } catch (error) {
        return next(error);
    }
}