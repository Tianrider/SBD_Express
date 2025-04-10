const express = require("express");
const router = express.Router();

const storeController = require("../controllers/store.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/getAll", authMiddleware, storeController.getAllStores);

router.post("/create", authMiddleware, storeController.createStore);

router.get("/:id", authMiddleware, storeController.getStoreFromId);

router.put("/", authMiddleware, storeController.updateStore);

router.delete("/:id", authMiddleware, storeController.deleteStore);

module.exports = router;
