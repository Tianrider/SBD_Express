const storeRepository = require("../repositories/store.repository");

const baseResponse = require("../utils/baseResponse");

exports.getAllStores = async (req, res) => {
	try {
		const stores = await storeRepository.getAllStores();
		baseResponse(res, true, 200, "Stores found", stores);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.createStore = async (req, res) => {
	try {
		const store = req.body;

		if (!store.name || !store.address) {
			throw new Error("Missing store name or address");
		}

		const newStore = await storeRepository.createStore(store);
		baseResponse(res, true, 201, "Store created", newStore);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.getStoreFromId = async (req, res) => {
	try {
		const id = req.params.id;
		const store = await storeRepository.getStoreFromId(id);

		if (store.length === 0) {
			throw new Error("Store not found");
		}

		baseResponse(res, true, 200, "Store found", store);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.updateStore = async (req, res) => {
	try {
		const store = req.body;

		if (!store.id) throw new Error("Missing store id");

		if (!store.name || !store.address) {
			throw new Error("Missing store id, name, or address");
		}

		const updatedStore = await storeRepository.updateStore(store);

		if (updatedStore.length === 0) throw new Error("Store not found");

		baseResponse(res, true, 200, "Store updated", updatedStore);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};

exports.deleteStore = async (req, res) => {
	try {
		const id = req.params.id;

		if (!id) throw new Error("Missing store id");

		const store = await storeRepository.getStoreFromId(id);

		if (store.length === 0) throw new Error("Store not found");

		const deletedStore = await storeRepository.deleteStore(id);

		baseResponse(res, true, 200, "Store deleted", deletedStore);
	} catch (error) {
		baseResponse(res, false, 500, error.message, null);
	}
};
