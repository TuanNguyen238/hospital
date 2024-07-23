const User = require('../models/user.js');
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
        const user = {
            username,
            email,
            password,
            phoneNumber,
            status
        };
        console.log("create");
        console.log(user);
        return this.#userRepository.createUser(user);
    }

    async getAllUsers() {
        return this.#userRepository.getAllUsers();
    }
}

module.exports = UserService;
