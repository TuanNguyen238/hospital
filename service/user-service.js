import { UserRepository } from '../repository/user-repository.js';

export class UserService {
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
