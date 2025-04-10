const {uploadToCloudinary} = require("../utils/cloudinary");
const baseResponse = require("../utils/baseResponse");
const itemRepository = require("../repositories/item.repository");

exports.createItem = async (req, res) => {
	try {
		const {name, price, store_id, stock} = req.body;

		if (!name || !price || !store_id || !stock) {
			throw new Error("Missing required fields");
		}

		if (!req.file) {
			throw new Error("Missing item image");
		}

		const cloudinaryResponse = await uploadToCloudinary(req.file.buffer);

		const item = {
			name,
			price,
			store_id,
			image_url: cloudinaryResponse.secure_url,
			stock,
		};

		const createdItem = await itemRepository.createItem(item);

		baseResponse(res, true, 201, "Item created", createdItem);
	} catch (error) {
		if (error.message.includes("Cannot destructure property 'rows'")) {
			return baseResponse(res, false, 404, "Store not found", null);
		}
		return baseResponse(res, false, 500, error.message, null);
	}
};

exports.getAllItems = async (req, res) => {
	try {
		const items = await itemRepository.getAllItem();
		baseResponse(res, true, 200, "Items retrieved", items);
	} catch (error) {
		return baseResponse(res, false, 500, error.message, null);
	}
};

exports.getItemById = async (req, res) => {
	try {
		const {id} = req.params;
		const item = await itemRepository.getItemById(id);

		if (item.length == 0) {
			return baseResponse(res, false, 404, "Item not found", null);
		}

		baseResponse(res, true, 200, "Item retrieved", item);
	} catch (error) {
		if (error.message.includes("Cannot destructure property 'rows'")) {
			return baseResponse(res, false, 404, "Item not found", null);
		}
		return baseResponse(res, false, 500, error.message, null);
	}
};

exports.getItemByStoreId = async (req, res) => {
	try {
		const {store_id} = req.params;
		const items = await itemRepository.getItemByStoreId(store_id);

		if (items.length == 0) {
			return baseResponse(res, false, 404, "Items not found", null);
		}

		baseResponse(res, true, 200, "Items retrieved", items);
	} catch (error) {
		if (error.message.includes("Cannot destructure property 'rows'")) {
			return baseResponse(res, false, 404, "Store doesnt exist", null);
		}
		return baseResponse(res, false, 500, error.message, null);
	}
};

exports.editItem = async (req, res) => {
	try {
		const {id, name, price, stock, store_id} = req.body;

		if (!id) {
			throw new Error("Missing id");
		}

		const item = await itemRepository.getItemById(id);
		if (item.length == 0) {
			return baseResponse(res, false, 404, "Item not found", null);
		}

		let newItemData = {
			name: name || item[0].name,
			price: price || item[0].price,
			stock: stock || item[0].stock,
			store_id: store_id || item[0].store_id,
			image_url: item[0].image_url,
		};

		if (req.file) {
			const cloudinaryResponse = await uploadToCloudinary(
				req.file.buffer
			);
			newItemData.image_url = cloudinaryResponse.secure_url;
		}

		const updatedItem = await itemRepository.editItem(id, newItemData);

		baseResponse(res, true, 200, "Item updated", updatedItem);
	} catch (error) {
		if (error.message.includes("Cannot destructure property 'rows'")) {
			return baseResponse(res, false, 404, "Item not found", null);
		}
		return baseResponse(res, false, 500, error.message, null);
	}
};

exports.deleteItem = async (req, res) => {
	try {
		const {id} = req.params;

		const item = await itemRepository.getItemById(id);
		if (item.length == 0) {
			return baseResponse(res, false, 404, "Item not found", null);
		}

		await itemRepository.deleteItem(id);

		baseResponse(res, true, 200, "Item deleted", item);
	} catch (error) {
		if (error.message.includes("Cannot destructure property 'rows'")) {
			return baseResponse(res, false, 404, "Item not found", null);
		}
		return baseResponse(res, false, 500, error.message, null);
	}
};
