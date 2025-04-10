const db = require("../database/pg.database");
const {setCache, deleteCache} = require("../utils/redis");

const CACHE_TTL = {
	USER: 3600, // 1 Jam untuk 1 user
	USER_LIST: 300, // 5 menit untuk semua user
};

exports.getTransactions = async () => {
	try {
		const cacheKey = `api:/transaction`;

		const {rows} = await db.query("SELECT * FROM transactions");

		if (rows.length > 0) {
			await setCache(cacheKey, rows);
			console.log("Cache miss on transactions");
		}

		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.createTransaction = async (transaction) => {
	try {
		const {rows} = await db.query(
			`INSERT INTO transactions (user_id, item_id, quantity, total) 
             SELECT $1, $2, $3, (SELECT price FROM items WHERE id = $2) * $3 
             RETURNING *`,
			[transaction.user_id, transaction.item_id, transaction.quantity]
		);

		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.getTransactionById = async (id) => {
	try {
		const cacheKey = `transaction:${id}`;

		const {rows} = await db.query(
			"SELECT * FROM transactions WHERE id = $1",
			[id]
		);

		if (rows.length > 0) {
			await setCache(cacheKey, rows);
			console.log("Cache miss on transaction");
		}

		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.setTransactionStatusToPaid = async (id) => {
	try {
		const {rows} = await db.query(
			`
            WITH updated_transaction AS (
                UPDATE transactions 
                SET status = 'paid' 
                WHERE id = $1 AND status = 'pending'
                RETURNING *
            ),
            update_user_balance AS (
                UPDATE users
                SET balance = balance - (SELECT total FROM updated_transaction)
                WHERE id = (SELECT user_id FROM updated_transaction)
                RETURNING *
            ),
            update_item_stock AS (
                UPDATE items
                SET stock = stock - (SELECT quantity FROM updated_transaction)
                WHERE id = (SELECT item_id FROM updated_transaction)
                RETURNING *
            )
            SELECT * FROM updated_transaction;
        `,
			[id]
		);

		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.getTransactionWithExtraData = async (id) => {
	try {
		const {rows} = await db.query(
			`SELECT transactions.id, transactions.user_id, transactions.item_id, transactions.quantity, transactions.total, transactions.status, transactions.created_at,
             items.name as item_name, items.price as item_price, items.image_url as item_image_url, items.stock as item_stock,
             users.name as user_name, users.email as user_email, users.balance as user_balance
             FROM transactions
             JOIN items ON transactions.item_id = items.id
             JOIN users ON transactions.user_id = users.id
             WHERE transactions.id = $1`,
			[id]
		);

		const cacheKey = `transaction:${id}`;

		if (rows.length > 0) {
			await setCache(cacheKey, rows);
			console.log("Cache miss on transaction");
		}

		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.deleteTransaction = async (id) => {
	try {
		const {rows} = await db.query(
			"DELETE FROM transactions WHERE id = $1",
			[id]
		);

		// delete juga cache di 'transactions'
		await deleteCache(`api:/transaction`);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
