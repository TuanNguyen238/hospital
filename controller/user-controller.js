const ErrorCode = require("../enum/error-code.js");
const UserService = require("../service/user-service.js");

class UserController {
  #userService = null;

  constructor() {
    this.#userService = new UserService();
  }

  async getAllUsers(req, res) {
    try {
      const users = await this.#userService.getAllUsers();
      const usersWithRoles = users.map((user) => {
        const userRoles = user.roles.map((role) => role.name);
        return { ...user, roles: userRoles };
      });
      res.status(200).json(usersWithRoles);
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
      const userId = await this.#userService.createUser(user);
      res.status(200).json({ id: userId, message: ErrorCode.REGISTED });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async updatePass(req, res) {
    try {
      const { phoneNumber, password } = req.body;
      const id = await this.#userService.updatePass(phoneNumber, password);
      res.status(200).json({ message: ErrorCode.PASS_UPDATED });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = UserController;
