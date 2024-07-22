const { DataSource } = require('typeorm');
const User = require('../models/user.js');
const Role = require('../models/role.js');
const dotenv = require('dotenv');

dotenv.config();

const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true, // modify database
    logging: false,
    entities: [User, Role],
});

AppDataSource.initialize();
console.log('Database connected and synchronized!');
module.exports = AppDataSource;
