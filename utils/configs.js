import dotenv from 'dotenv'

dotenv.config()

export const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
};

export const createDB = 'CREATE DATABASE IF NOT EXISTS db_hospital_booking';
export const useDB = `USE ${process.env.MYSQL_DATABASE}`;