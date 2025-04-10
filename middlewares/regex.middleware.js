const baseResponse = require("../utils/baseResponse");

const emailValidator = (req, res, next) => {
	const {email} = Object.keys(req.body).length === 0 ? req.query : req.body;

	const emailRegex =
		/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

	console.log("received email: ", email);
	if (!emailRegex.test(email)) {
		return baseResponse(res, false, 400, "Invalid email format", null);
	}

	next();
};

const passwordValidator = (req, res, next) => {
	const {password} =
		Object.keys(req.body).length === 0 ? req.query : req.body;

	const passwordRegex = /^(?=.*[0-9])(?=.*[!@#%^&*])[a-zA-Z0-9!@#$%^&*]{8,}/;

	if (!passwordRegex.test(password)) {
		return baseResponse(res, false, 400, "Invalid password format", null);
	}

	next();
};

module.exports = {
	emailValidator,
	passwordValidator,
};
