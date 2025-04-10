const {verifyToken} = require("../utils/jwt");
const baseResponse = require("../utils/baseResponse");

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return baseResponse(
			res,
			false,
			401,
			"Access denied. No token provided",
			null
		);
	}

	const token = authHeader.split(" ")[1];

	const decoded = verifyToken(token);

	if (!decoded) {
		return baseResponse(res, false, 403, "Invalid or expired token", null);
	}

	req.user = decoded;
	next();
};

module.exports = authMiddleware;
