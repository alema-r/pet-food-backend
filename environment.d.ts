// necessary to use process.env variables
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            PORT?: string;
            PWD: string;
            PGDATABASE: string,
            PGUSER: string,
            PGPASS: string,
            PGHOST: string,
        }
    }
}

// to treat this script as module
export{}