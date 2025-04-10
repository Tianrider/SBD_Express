const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "24h";

const generateToken = (user) => {
	const payload = {
		id: user.id,
		email: user.email,
		name: user.name,
	};

	return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRY});
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (error) {
		return null;
	}
};

module.exports = {
	generateToken,
	verifyToken,
};
