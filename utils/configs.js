const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

const createDB = 'CREATE DATABASE IF NOT EXISTS db_hospital_booking';
const useDB = `USE ${process.env.MYSQL_DATABASE}`;

module.exports = {
    dbConfig,
    createDB,
    useDB
};