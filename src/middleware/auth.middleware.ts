import express from "express";
import { Role } from "../models/users";
import { verify } from "jsonwebtoken";

export async function checkAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        console.log('checkauth');
        let authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({error: "Missing JWT Token"});
        }
        // Deletes "bearer"
        const jwt = authHeader.split(' ')[1];
        // verifies if token is valid
        verify(jwt, process.env.JWT_SECRET, function(err, decoded){
            if (err){
                // token not valid, send the error to the error handler middleware
                next(err);
            }
            // token is valid
            if (typeof(decoded) === "string"){
                req.user = JSON.parse(decoded);
            }
            else{
                req.user = decoded!;
            }
        });

        next();
    } catch (error){
        return res.send(500).json({error: error})
    }
}

export const checkPrivileges = (privilegeNeeded: Role, resource?: any) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("checkPriv");
    if(req.user.role === privilegeNeeded){
        console.log("PrivOK");
        next();
    }
    else{
        return res.status(403).json({ message: "You don't have enough privileges to perform this action"});
    }
}