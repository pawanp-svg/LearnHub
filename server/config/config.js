import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export default {
  development: {
    username: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    host: process.env.DBHOST,
    dialect: process.env.DBDIALECT,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
