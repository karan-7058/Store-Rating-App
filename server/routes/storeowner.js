const express = require("express");
const requireStoreOwner = require("../middleware/requireStoreOwner");
const router = express.Router();
const storeOwnerController = require("../controllers/storeOwnerController");


// Owner: Get all stores owned by this store owner
router.get("/owner/stores", requireStoreOwner, storeOwnerController.getStoresByOwner);

// Owner: View ratings for a specific store (owned by them)
router.get("/owner/stores/:id/ratings", requireStoreOwner, storeOwnerController.getStoreRatings);

router.put("/owner/stores/:id" , requireStoreOwner , storeOwnerController.updateStoreByOwner);


module.exports = router;
