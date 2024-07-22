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
    entities: ["../models/**/*.js"],
});

AppDataSource.initialize()
    .then(() => console.log('Database connected and synchronized!'))
    .catch(err => console.error('Database connection error:', err));

module.exports = AppDataSource;
