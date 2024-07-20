import express from 'express';
import { UserService } from '../service/user-service.js';

const router = express.Router();

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
            const { name, email, password } = req.body;
            const userId = await this.#userService.createUser(name, email, password);
            res.status(201).json({ id: userId });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}

const userController = new UserController();

router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.post('/', (req, res) => userController.createUser(req, res));

export default router;
