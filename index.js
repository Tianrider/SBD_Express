const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const corsOptions = {
	origin: "https://os.netlabdte.com",
	methods: ["GET", "POST", "PUT", "DELETE"],
};

const port = process.env.PORT || 3000;

const app = express();

const storeRoute = require("./routes/store.route.js");
const userRoute = require("./routes/user.route.js");
const itemRoute = require("./routes/item.route.js");
const transactionRoute = require("./routes/transaction.route.js");
const rateLimit = require("express-rate-limit");
const {redisClient} = require("./utils/redis.js");
const sqlInjectionFilter = require("./middlewares/sql-injection.middleware.js");

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 Menit
	limit: 100, // Limit setiap IP ke 100 Request setiap 15 Menit
	message: "Too many requests, please try again later.",
});

app.use(limiter);
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(sqlInjectionFilter);

app.use("/store", storeRoute);
app.use("/user", userRoute);
app.use("/item", itemRoute);
app.use("/transaction", transactionRoute);

app.listen(port, () => {
	console.log("Server is running on port 3000");
});

process.on("SIGINT", async () => {
	await redisClient.quit();
	console.log("Redis connection closed");
	process.exit(0);
});
