const { Repository } = require('typeorm');
const User = require('../models/user.js');
const AppDataSource = require('../utils/configs.js');

class UserRepository {
    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async getUserById(id) {
        return await this.repository.findOneBy({ id: id });
    }

    async createUser(user) {
        
        await this.repository.save(user);
        return user.id;
    }

    async getAllUsers() {
        return await this.repository.find();
    }
}

module.exports = UserRepository;
