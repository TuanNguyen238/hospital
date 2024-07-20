import mysql from 'mysql2/promise';
import { dbConfig } from '../utils/configs.js';
import { UserQuery } from '../utils/user-query.js';

export class UserRepository {
    #pool = null;
    constructor() {
        this.#pool = mysql.createPool(dbConfig);
    }

    async getUserById(id) {
        const [rows] = await this.#pool.query(UserQuery.getUserById, [id]);
        return rows[0];
    }

    async createUser(name, email, password) {
        const [result] = await this.#pool.query(UserQuery.createUser, [name, email, password]);
        return result.insertId;
    }

    async getAllUsers() {
        const [rows] = await this.#pool.query(UserQuery.getAllUsers);
        return rows;
    }
}