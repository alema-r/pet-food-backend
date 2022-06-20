module.exports = {
  "development": {
    "username": process.env.PGUSER,
    "password": process.env.PGPASS,
    "database": process.env.PGDATABASE,
    "host": process.env.PGHOST,
    "dialect": "postgres"
  },
  "test": {
    "username": process.env.PGUSER,
    "password": process.env.PGPASS,
    "database": process.env.PGDATABASE_TEST,
    "host": process.env.PGHOST,
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.PGUSER,
    "password": process.env.PGPASS,
    "database": process.env.PGDATABASE_PROD,
    "host": process.env.PGHOST,
    "dialect": "postgres"
  }
}
