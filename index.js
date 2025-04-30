const express = require("express");
const cors = require("cors");

const corsOptions = {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true,
	allowedHeaders: ["Content-Type", "Authorization"],
};

const port = process.env.PORT || 3000;

const app = express();

const storeRoute = require("./routes/store.route.js");
const userRoute = require("./routes/user.route.js");
const itemRoute = require("./routes/item.route.js");
const transactionRoute = require("./routes/transaction.route.js");
// const rateLimit = require("express-rate-limit");
const sqlInjectionFilter = require("./middlewares/sql-injection.middleware.js");
const db = require("./database/pg.database");

// Production rate limiting
// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 100, // Limit each IP to 100 requests per window
// 	message: "Too many requests, please try again later.",
// });

// Security middleware
// app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(sqlInjectionFilter);

// Health check endpoint
app.get("/health", async (req, res) => {
	const health = {
		uptime: process.uptime(),
		timestamp: Date.now(),
		services: {
			database: await checkDatabaseHealth(),
		},
	};

	const isHealthy = health.services.database;

	res.status(isHealthy ? 200 : 503).json(health);
});

// Basic route
app.get("/", (req, res) => {
	res.send("Server is running");
});

// API routes
app.use("/store", storeRoute);
app.use("/user", userRoute);
app.use("/item", itemRoute);
app.use("/transaction", transactionRoute);

// Database health check
async function checkDatabaseHealth() {
	try {
		const result = await db.query("SELECT 1");
		return result && result.rows && result.rows.length > 0;
	} catch (error) {
		console.error("Database health check failed:", error);
		return false;
	}
}

// Start server
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
