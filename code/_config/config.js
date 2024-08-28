require("dotenv").config(); // this is important!
module.exports = {
  secret: "Animals Vet Secret",
  algorithm: process.env.ALGORITHM,
  dbConfig: {
    user: process.env.USER,
    password: process.env.ROOT_PASSWORD,
    host: process.env.HOST,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
    dialect: process.env.DIALECT || "mysql",
  },
};
