const UserService = require("../service/user-service.js");

class UserController {
  #userService = null;

  constructor() {
    this.#userService = new UserService();
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.#userService.getAllUsers();
      res.status(200).json(users);
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
      const message = await this.#userService.createUser(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async forgotPass(req, res) {
    try {
      const message = await this.#userService.forgotPass(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updatePass(req, res) {
    try {
      const message = await this.#userService.updatePass(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updatePassAdmin(req, res) {
    try {
      const message = await this.#userService.updatePassAdmin(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateInfo(req, res) {
    try {
      const message = await this.#userService.updateInfo(req.body);
      res.status(200).json(message);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getCountUser(req, res) {
    try {
      const count = await this.#userService.getCountUser();
      res.status(200).json({ message: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getCountDoctor(req, res) {
    try {
      const count = await this.#userService.getCountDoctor();
      res.status(200).json({ message: count });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UserController;
