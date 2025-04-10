const {
	getCache,
	setCache,
	deleteCache,
	clearAllCache,
} = require("../utils/redis");
const baseResponse = require("../utils/baseResponse");

const cacheMiddleware = (expiryInSeconds = 3600) => {
	return async (req, res, next) => {
		try {
			if (req.method !== "GET") {
				return next();
			}

			const cacheKey = `api:${req.originalUrl || req.url}`;

			const cachedData = await getCache(cacheKey);

			if (cachedData) {
				console.log("Cache hit on", cacheKey);
				const {success, message, payload} = cachedData;
				return baseResponse(
					res,
					success,
					200,
					`${message} (cached)`,
					payload
				);
			}
			const originalSend = res.json;

			res.json = function (body) {
				if (body && body.success) {
					setCache(cacheKey, body, expiryInSeconds);
				}

				return originalSend.call(this, body);
			};

			next();
		} catch (error) {
			console.error("Cache middleware error:", error);
			next();
		}
	};
};

const clearCacheMiddleware = () => {
	return async (req, res, next) => {
		try {
			const cacheKey = `api:${req.originalUrl || req.url}`;

			await deleteCache(cacheKey);

			console.log("Cache cleared on", cacheKey);
			return next();
		} catch (error) {
			console.error("Clear cache middleware error:", error);
			return baseResponse(res, false, 500, "Internal server error", null);
		}
	};
};

module.exports = {
	cacheMiddleware,
	clearCacheMiddleware,
};
