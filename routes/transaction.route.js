const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const {
	cacheMiddleware,
	clearCacheMiddleware,
} = require("../middlewares/cache.middleware");

router.get(
	"/",
	authMiddleware,
	cacheMiddleware(),
	transactionController.getTransactions
);

router.post(
	"/create",
	authMiddleware,
	clearCacheMiddleware(),
	transactionController.createTransaction
);

router.post(
	"/pay/:id",
	authMiddleware,
	clearCacheMiddleware(),
	transactionController.setTransactionStatusToPaid
);

router.delete(
	"/:id",
	authMiddleware,
	clearCacheMiddleware(),
	transactionController.deleteTransaction
);

module.exports = router;
