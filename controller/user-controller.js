const UserService = require('../service/user-service.js');

class UserController {
    #userService = null;

    constructor() {
        this.#userService = new UserService();
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.#userService.getAllUsers();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async getUserById(req, res) {
        try {
            const user = await this.#userService.getUserById(req.params.id);
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async createUser(req, res) {
        try {
            const user = req.body;
            const userId = await this.#userService.createUser(user);
            res.status(201).json({ id: userId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

module.exports = UserController;
