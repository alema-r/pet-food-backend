import express from "express";
import { User } from "../models/users";

/**
 * Fetches all users in the database
 * @param req the HTTP request
 * @param res the HTTP response
 * @returns an HTTP response with a json object containing all users
 */
export async function getAllUsers(req: express.Request, res: express.Response) {
    try {
        const allUsers = await User.findAll();
        return res.status(200).json(allUsers);
    } catch (error) {
        return res.status(500).json(error);
    }
};

/**
 * Fetches the user with the id specified by the endpoint
 * @param req the HTTP request
 * @param res the HTTP response
 * @returns the user requested if found, otherwise an error
 */
export async function getUserById(req: express.Request, res: express.Response) {
    try {
        const user: User | null = await User.findByPk(req.params.id);
        if (user === null) {
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
}

