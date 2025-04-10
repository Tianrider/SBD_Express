const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {fileSize: 20 * 1024 * 1024},
});

const itemController = require("../controllers/item.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/", authMiddleware, itemController.getAllItems);

router.post(
	"/create",
	authMiddleware,
	upload.single("image"),
	itemController.createItem
);

router.get("/byId/:id", authMiddleware, itemController.getItemById);

router.get(
	"/byStoreId/:store_id",
	authMiddleware,
	itemController.getItemByStoreId
);

router.put(
	"/",
	authMiddleware,
	upload.single("image"),
	itemController.editItem
);

router.delete("/:id", authMiddleware, itemController.deleteItem);

module.exports = router;
