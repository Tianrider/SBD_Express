const userRepository = require("../repositories/user.repository");

const baseResponse = require("../utils/baseResponse");
const {compareHashedPassword} = require("../utils/passwordHashing");
const {generateToken} = require("../utils/jwt");

exports.registerUser = async (req, res) => {
	try {
		const user = req.query;

		if (!user.email || !user.password) {
			throw new Error("Missing email or password");
		}

		const checkEmail = await userRepository.getUserByEmail(user.email);
		if (checkEmail.length > 0) {
			throw new Error("Email already used");
		}

		const newUser = await userRepository.registerUser(user);
		baseResponse(res, true, 201, "User created", newUser);
	} catch (error) {
		console.log("error :>> ", error);
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.getUserByEmail = async (req, res) => {
	try {
		const email = req.params.email;

		if (!email) {
			throw new Error("Missing email");
		}

		const user = await userRepository.getUserByEmail(email);

		if (user.length === 0) {
			throw new Error("User not found");
		}

		baseResponse(res, true, 200, "User found", user);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.loginUser = async (req, res) => {
	try {
		const user = req.query;

		if (!user.email || !user.password) {
			throw new Error("Missing email or password");
		}

		const checkUser = await userRepository.getUserByEmail(user.email);

		if (checkUser.length === 0) {
			throw new Error("User not Found");
		}

		const checkPassword = await compareHashedPassword(
			user.password,
			checkUser[0].password
		);

		if (!checkPassword) {
			throw new Error("Password is incorrect");
		}

		const token = generateToken(checkUser[0]);

		baseResponse(res, true, 200, "Login Success", {
			user: checkUser[0],
			token,
		});
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.updateUser = async (req, res) => {
	try {
		const user = req.body;

		if (!user.email || !user.password || !user.name) {
			throw new Error("Missing email, password, or name");
		}

		const checkUser = await userRepository.getUserById(user.id);

		if (checkUser.length === 0) {
			throw new Error("User not Found");
		}

		const updatedUser = await userRepository.updateUser(user);

		baseResponse(res, true, 200, "User updated", updatedUser);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const id = req.params.id;

		if (!id) throw new Error("Missing user id");

		const user = await userRepository.getUserById(id);

		if (user.length === 0) throw new Error("User not found");

		await userRepository.deleteUserById(id);

		baseResponse(res, true, 200, "User deleted", user);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.topUpBalance = async (req, res) => {
	try {
		const {id, amount} = req.query;

		if (!id || !amount) {
			throw new Error("Missing id or amount");
		}

		if (amount <= 0) {
			throw new Error("Amount must be larger than 0");
		}

		const updatedUser = await userRepository.topUpBalance(id, amount);

		baseResponse(res, true, 200, "Balance updated", updatedUser);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};
