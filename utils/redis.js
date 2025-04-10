const Redis = require("ioredis");

require("dotenv").config();

console.log("Connecting to Redis at:", {
	host: process.env.REDIS_HOST || "localhost",
	port: process.env.REDIS_PORT || 6379,
});

const redisClient = new Redis({
	host: process.env.REDIS_HOST || "localhost",
	port: process.env.REDIS_PORT || 6379,
	password: null,
	connectTimeout: 10000,
});

// Jika redis gagal, local cache
const localCache = new Map();

redisClient.on("error", (err) => {
	console.error("Redis Error:", err);
	if (err.code === "ECONNREFUSED") {
		console.warn(
			"Redis server is not available. Using local memory cache as fallback."
		);
	}
});

redisClient.on("connect", () => {
	console.log("Redis Connected Successfully");

	// clear local cache jika berhasil connect ke redis
	localCache.clear();
});

const getCache = async (key) => {
	try {
		if (!redisClient.status || redisClient.status !== "ready") {
			console.log(`Using local cache for get: ${key}`);
			const localValue = localCache.get(key);
			return localValue || null;
		}

		const data = await redisClient.get(key);
		return data ? JSON.parse(data) : null;
	} catch (error) {
		console.error(`Redis getCache error: ${error.message}`);
		const localValue = localCache.get(key);
		return localValue || null;
	}
};

const setCache = async (key, value, ttl = 60) => {
	try {
		if (!redisClient.status || redisClient.status !== "ready") {
			console.log(`Using local cache for set: ${key}`);
			localCache.set(key, value);
			if (ttl > 0) {
				setTimeout(() => localCache.delete(key), ttl * 1000);
			}
			return;
		}

		await redisClient.set(key, JSON.stringify(value), "EX", ttl);
	} catch (error) {
		console.error(`Redis setCache error: ${error.message}`);
		localCache.set(key, value);
	}
};

const deleteCache = async (key) => {
	try {
		if (!redisClient.status || redisClient.status !== "ready") {
			localCache.delete(key);
			return;
		}

		await redisClient.del(key);
	} catch (error) {
		console.error(`Redis deleteCache error: ${error.message}`);
		localCache.delete(key);
	}
};

const clearAllCache = async () => {
	try {
		if (!redisClient.status || redisClient.status !== "ready") {
			localCache.clear();
			return;
		}

		await redisClient.flushall();
	} catch (error) {
		console.error(`Redis clearAllCache error: ${error.message}`);

		localCache.clear();
	}
};

module.exports = {
	redisClient,
	getCache,
	setCache,
	deleteCache,
	clearAllCache,
};
