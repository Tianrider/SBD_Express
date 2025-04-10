const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const {
	emailValidator,
	passwordValidator,
} = require("../middlewares/regex.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

router.post(
	"/register",
	emailValidator,
	passwordValidator,
	userController.registerUser
);

router.post("/login", userController.loginUser);

router.get("/:email", authMiddleware, userController.getUserByEmail);

router.put(
	"/",
	authMiddleware,
	emailValidator,
	passwordValidator,
	userController.updateUser
);

router.delete("/:id", authMiddleware, userController.deleteUser);

router.post("/topUp", authMiddleware, userController.topUpBalance);

module.exports = router;
