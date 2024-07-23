const { DataSource } = require("typeorm");
const dotenv = require("dotenv");

dotenv.config();

const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: true, // modify database
  logging: false,
  entities: [__dirname + "/../models/*.js"],
});

module.exports = AppDataSource;
