const express = require("express");
const UserController = require("../controllers/user-controller");

const router = express.Router();
const userController = new UserController();

router.get("/", (req, res) => userController.getAllUsers(req, res));
router.get("/:id", (req, res) => userController.getUserById(req, res));
router.post("/", (req, res) => userController.createUser(req, res));

module.exports = router;
