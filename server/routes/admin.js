const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const adminController = require('../controllers/adminController');


router.get('/users', requireAdmin, adminController.getAllUsers);
router.get('/stats', requireAdmin, adminController.getStats);
router.get('/stores', requireAdmin, adminController.getAllStores);
router.post('/stores', requireAdmin , adminController.createStore);
router.put('/stores/:id', requireAdmin, adminController.updateStore);
router.delete('/stores/:id', requireAdmin, adminController.deleteStore);

module.exports = router;