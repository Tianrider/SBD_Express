const db = require("../database/pg.database");

exports.getAllStores = async () => {
	try {
		const {rows} = await db.query("SELECT * FROM stores");
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.createStore = async (store) => {
	try {
		const {rows} = await db.query(
			"INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *",
			[store.name, store.address]
		);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.getStoreFromId = async (id) => {
	try {
		const {rows} = await db.query("SELECT * FROM stores WHERE id = $1", [
			id,
		]);
		return rows;
	} catch (error) {
		return error;
	}
};

exports.updateStore = async (store) => {
	try {
		let rows;
		if (store.created_at) {
			({rows} = await db.query(
				"UPDATE stores SET name = $1, address = $2, created_at = $3 WHERE id = $4 RETURNING *",
				[store.name, store.address, store.created_at, store.id]
			));
		} else {
			({rows} = await db.query(
				"UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *",
				[store.name, store.address, store.id]
			));
		}

		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

exports.deleteStore = async (id) => {
	try {
		const {rows} = await db.query("DELETE FROM stores WHERE id = $1", [id]);
		return rows;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
