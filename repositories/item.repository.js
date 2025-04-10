const db = require("../database/pg.database");

exports.createItem = async (item) => {
	try {
		const {rows} = await db.query(
			"INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
			[item.name, item.price, item.store_id, item.image_url, item.stock]
		);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.getAllItem = async () => {
	try {
		const {rows} = await db.query("SELECT * FROM items");
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.getItemById = async (id) => {
	try {
		const {rows} = await db.query("SELECT * FROM items WHERE id = $1", [
			id,
		]);
		return rows;
	} catch (error) {
		throw error;
	}
};

exports.getItemByStoreId = async (id) => {
	try {
		const {rows} = await db.query(
			"SELECT * FROM items WHERE store_id = $1",
			[id]
		);
		return rows;
	} catch (error) {
		throw error;
	}
};

exports.editItem = async (id, item) => {
	try {
		const {rows} = await db.query(
			"UPDATE items SET name = $1, price = $2, stock = $3, store_id = $4, image_url = $5 WHERE id = $6 RETURNING *",
			[
				item.name,
				item.price,
				item.stock,
				item.store_id,
				item.image_url,
				id,
			]
		);
		return rows;
	} catch (error) {
		throw error;
	}
};

exports.deleteItem = async (id) => {
	try {
		const {rows} = await db.query("DELETE FROM items WHERE id = $1", [id]);
		return rows;
	} catch (error) {
		throw error;
	}
};
