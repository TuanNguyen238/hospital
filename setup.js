// repository/setup.js
import mysql from 'mysql2/promise';
import { UserQuery } from './utils/user-query.js';
import { createDB, useDB } from './utils/configs.js';
import dotenv from 'dotenv'

dotenv.config()

export class Setup {
    #connection = null;
    
    async initializeConnection() {
        try {
            this.#connection = await mysql.createConnection({
                host: process.env.MYSQL_HOST,
                user: process.env.MYSQL_USER,
                password: process.env.MYSQL_PASSWORD
            });
            console.log("Connected!");
        } catch (err) {
            console.error("Error connecting to the database:", err);
            throw err;
        }
    }

    async setupDatabase() {
        try {
            await this.initializeConnection();

            //await this.#connection.query(createDB);

            await this.#connection.query(useDB);

            await this.#setupUsersTable();
        } catch (err) {
            console.error("Error occurred:", err);
        } finally {
            if (this.#connection) {
                await this.#connection.end();
            }
        }
    }

    async #setupUsersTable() {
        try {
            const [tables] = await this.#connection.query(UserQuery.showTable, ['users']);
            if (tables.length === 0) {
                await this.#connection.query(UserQuery.createTable); 
                console.log("Users table created");

                const users = [
                    ['admin1', 'hendong34@gmail.com', 'admin1'],
                    ['admin2', 'tuannguyen23823@gmail.com', 'admin2'],
                    ['admin3', 'lethithuyduyen230803@gmail.com', 'admin3']
                ];
                for (let user of users) {
                    await this.#connection.query(UserQuery.createUser, user);
                    console.log(`Inserted row ${user[0]} into users table`);
                }
            } else {
                console.log("Users table already exists");
            }
        } catch (err) {
            console.error("Error setting up users table:", err);
        }
    }
}
