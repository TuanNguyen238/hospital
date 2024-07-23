const UserRepository = require('../repository/user-repository.js');

class UserService {
    #userRepository = null;

    constructor() {
        this.#userRepository = new UserRepository();
    }

    async getUserById(id) {
        return this.#userRepository.getUserById(id);
    }

    async createUser(username, email, password, phoneNumber, status) {
        return this.#userRepository.createUser(username, email, password, phoneNumber, status);
    }

    async getAllUsers() {
        return this.#userRepository.getAllUsers();
    }
}

module.exports = UserService;
