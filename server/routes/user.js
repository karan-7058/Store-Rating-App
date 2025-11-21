const express = require('express');

const router = express.Router();
const requireAuth = require('../middleware/requireAuth');
const userController = require('../controllers/userController');



router.get('/stores', userController.getAllStores);

router.get('/stores/:id', userController.getStoreById);

router.post('/stores/:id/ratings', requireAuth, userController.addRating);

router.put('/ratings/:id' , requireAuth , userController.updateRating);

router.delete('/ratings/:id' , requireAuth , userController.deleteRating);


module.exports = router;