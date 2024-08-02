const { messaging } = require("firebase-admin");
const UserService = require("../service/user-service.js");

class UserController {
  #userService = null;

  constructor() {
    this.#userService = new UserService();
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.#userService.getAllUsers();
      return users;
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await this.#userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async createUser(req, res) {
    try {
      const user = req.body;
      const message = await this.#userService.createUser(user);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async forgotPass(req, res) {
    try {
      const { phoneNumber, password } = req.body;
      const message = await this.#userService.forgotPass(phoneNumber, password);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updatePass(req, res) {
    try {
      const obj = req.body;
      const message = await this.#userService.updatePass(obj);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateInfo(req, res) {
    try {
      const obj = req.body;
      const message = await this.#userService.updateInfo(obj);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getCount(req, res) {
    try {
      const count = await this.#userService.getCount();
      res.status(200).json({ message: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UserController;
