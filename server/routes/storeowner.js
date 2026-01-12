const express = require("express");
const requireStoreOwner = require("../middleware/requireStoreOwner");
const router = express.Router();
const storeOwnerController = require("../controllers/storeOwnerController");


// Owner: Get all stores owned by this store owner
router.get("/stores", requireStoreOwner, storeOwnerController.getStoresByOwner);

// Owner: View ratings for a specific store (owned by them)
router.get("/stores/:id/ratings", requireStoreOwner, storeOwnerController.getStoreRatings);

router.put("/stores/:id" , requireStoreOwner , storeOwnerController.updateStoreByOwner);
router.post('/stores', requireStoreOwner, storeOwnerController.createStore);



module.exports = router;
