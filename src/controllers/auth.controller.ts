import express from "express";
import { hash, compare } from "bcrypt";
import { UserCreateModel, Role, User } from "../models/users";
import { generateToken } from "../util/jwt";
import { JwtPayload } from "jsonwebtoken";

/**
 * Function that creates a User. Params are taken from the body of the request
 * @param req the HTTP request
 * @param res the HTTP response
 * @returns A response with a message of success or an error.
 */
export async function register(req: express.Request, res: express.Response) {
    try {
        const userModel: UserCreateModel = { username: req.body.username, password: req.body.password, role: Role.USER };
        const searchForDup: User | null = await User.findOne({ where: { username: userModel.username } });
        if (searchForDup !== null) {
            return res.status(400).json({ error: "User already exists." });
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
 * @param req the HTTP request
 * @param res the HTTP response
 * @returns A response with the jwt or an error message in case of failure.
 */
export async function login(req: express.Request, res: express.Response) {
    try {
        const username: string = req.body.username;
        const password: string = req.body.password;
        const dbUser: User | null = await User.findOne({ where: { username: username } });
        if (dbUser === null) {
            return res.status(400).json({ error: "User doesn't exists." });
        }
        const checkPassword = await compare(password, dbUser.password);
        if (!checkPassword) {
            return res.status(200).json({ error: "User/password pair don't match." });
        }
        const payload: JwtPayload = { username: dbUser.username, role: dbUser.role };
        const jwtToken: string = generateToken(payload);
        
        return res.json({ token: jwtToken });
    } catch (error) {
        return res.status(500).json(error);
    }
}