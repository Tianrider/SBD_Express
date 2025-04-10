const db = require("../database/pg.database");
const {hashPassword} = require("../utils/passwordHashing");

exports.registerUser = async (user) => {
	try {
		const hashedPassword = await hashPassword(user.password);
		const {rows} = await db.query(
			"INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *",
			[user.email, hashedPassword, user.name]
		);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.getUserByEmail = async (email) => {
	try {
		const {rows} = await db.query("SELECT * FROM users WHERE email = $1", [
			email,
		]);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.updateUser = async (user) => {
	try {
		let hashedPassword;
		if (user.password) {
			hashedPassword = await hashPassword(user.password);
		}

		const {rows} = await db.query(
			"UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4 RETURNING *",
			[user.email, hashedPassword, user.name, user.id]
		);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.getUserById = async (id) => {
	try {
		const {rows} = await db.query("SELECT * FROM users WHERE id = $1", [
			id,
		]);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.deleteUserById = async (id) => {
	try {
		const {rows} = await db.query("DELETE FROM users WHERE id = $1", [id]);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.topUpBalance = async (id, amount) => {
	try {
		const {rows} = await db.query(
			"UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
			[amount, id]
		);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
