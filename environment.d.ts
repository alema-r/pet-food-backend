import { Jwt, JwtPayload } from "jsonwebtoken";

declare global {
    // necessary to use process.env variables
    namespace NodeJS {
        interface ProcessEnv {
            JWT_SECRET: string;
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            PWD: string;
            PGDATABASE: string,
            PGUSER: string,
            PGPASS: string,
            PGHOST: string,
        }
    }
    // to add properties to `express.Request`
    namespace Express {
    interface Request {
      user: JwtPayload;
    }
  }
}

// to treat this script as module
export{}