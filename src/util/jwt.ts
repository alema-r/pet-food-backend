import {JwtPayload, sign, verify} from "jsonwebtoken";

export function generateToken(payload: JwtPayload){
    const token: string = sign(payload, process.env.JWT_SECRET, {expiresIn: '3h'});
    return token;
}

export function verifyAndDecodeToken(token: string){
    let decodedPayload: string | JwtPayload = ""; 
    verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err){
            throw err;
        }
        decodedPayload = decoded!;
    });
    return decodedPayload;
}