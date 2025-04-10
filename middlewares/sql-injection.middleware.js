const baseResponse = require("../utils/baseResponse");

const sqlInjectionFilter = (req, res, next) => {
	console.log("Checking for SQL injection");

	const sqlPatterns = [
		/('|").*--/i, // Comment attacks
		/;.*(--|\/\*|drop|alter|create|truncate|delete|update|insert)/i, // Multiple statements or DDL
		/union\s+select/i, // UNION attacks
		/exec\s+xp_/i, // Stored procedure attacks
		/SLEEP\s*\(\s*\d+\s*\)/i, // Time-based attacks
		/BENCHMARK\s*\(\s*\d+\s*,/i, // Time-based attacks
		/\/\*.*\*\//i, // Block comments
		/information_schema/i, // Information schema
		/load_file/i, // File operations
		/into\s+(out|dump)file/i, // File operations
	];

	const checkValue = (value) => {
		console.log("Checking value", value);
		if (typeof value !== "string") {
			console.log("Value is not a string");
			return false;
		}

		return sqlPatterns.some((pattern) => pattern.test(value));
	};

	const checkObject = (obj) => {
		if (!obj || typeof obj !== "object") return false;

		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				const value = obj[key];

				if (typeof value === "string" && checkValue(value)) {
					return true;
				} else if (typeof value === "object" && checkObject(value)) {
					return true;
				}
			}
		}

		return false;
	};

	if (
		checkObject(req.body) ||
		checkObject(req.query) ||
		checkObject(req.params)
	) {
		console.log("SQL injection detected");
		return baseResponse(
			res,
			false,
			400,
			"Potential SQL injection attack detected",
			null
		);
	}

	next();
};

module.exports = sqlInjectionFilter;
