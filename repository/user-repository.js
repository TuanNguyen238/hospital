const { Repository } = require('typeorm');
const User = require('../models/user.js');
const AppDataSource = require('../utils/configs.js');

class UserRepository {
    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async getUserById(id) {
        return await this.repository.findOne({ where: { id } });
    }

    async createUser(userData) {
        const user = this.repository.create(userData);
        await this.repository.save(user);
        return user.id;
    }

    async getAllUsers() {
        return await this.repository.find();
    }
}

module.exports = UserRepository;
