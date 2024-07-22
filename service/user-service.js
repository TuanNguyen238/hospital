const UserRepository = require('../repository/user-repository.js');

class UserService {
    #userRepository = null;

    constructor() {
        this.#userRepository = new UserRepository();
    }

    async getUserById(id) {
        return this.#userRepository.getUserById(id);
    }

    async createUser(name, email, password) {
        return this.#userRepository.createUser(name, email, password);
    }

    async getAllUsers() {
        return this.#userRepository.getAllUsers();
    }
}

module.exports = UserService;
