const transactionRepository = require("../repositories/transaction.repository");

const baseResponse = require("../utils/baseResponse");

exports.getTransactions = async (req, res) => {
	try {
		const transactions = await transactionRepository.getTransactions();
		baseResponse(res, true, 200, "Transactions fetched", transactions);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.createTransaction = async (req, res) => {
	console.log(req.body);
	try {
		const {item_id, quantity, user_id} = req.body;
		if (!item_id || !quantity || !user_id) {
			throw new Error("Missing required fields");
		}

		const transaction = {
			item_id,
			quantity,
			user_id,
		};

		if (quantity <= 0) {
			throw new Error("Quantity must be larger than 0");
		}

		const createdTransaction =
			await transactionRepository.createTransaction(transaction);

		baseResponse(res, true, 201, "Transaction created", createdTransaction);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.setTransactionStatusToPaid = async (req, res) => {
	try {
		const {id} = req.params;

		// Check current transaction status
		const transaction =
			await transactionRepository.getTransactionWithExtraData(id);

		console.log("Checking transaction..", transaction);

		if (transaction.length === 0) {
			throw new Error("Transaction not found");
		}

		// check if transaction is already paid
		if (transaction[0].status === "paid") {
			throw new Error("Transaction already paid");
		}

		// check balance
		if (transaction[0].user_balance < transaction[0].total) {
			throw new Error("Insufficient balance");
		}

		// Check if item is in stock
		if (transaction[0].item_stock < transaction[0].quantity) {
			throw new Error("Insufficient stock");
		}

		const updatedTransaction =
			await transactionRepository.setTransactionStatusToPaid(id);

		if (updatedTransaction.length === 0) {
			throw new Error("Failed to pay");
		}

		baseResponse(res, true, 200, "Payment Sucessful", updatedTransaction);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.deleteTransaction = async (req, res) => {
	try {
		const {id} = req.params;

		const transaction = await transactionRepository.getTransactionById(id);

		if (transaction.length === 0) {
			throw new Error("Transaction not found");
		}

		await transactionRepository.deleteTransaction(id);

		baseResponse(res, true, 200, "Transaction deleted", transaction);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};
