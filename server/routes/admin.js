const express = require('express');
const router = express.Router();
const requireAdmin = require('../middleware/requireAdmin');
const adminController = require('../controllers/adminController');


router.get('/admin/users', requireAdmin, adminController.getAllUsers);
router.get('/admin/stats', requireAdmin, adminController.getStats);
router.get('/admin/stores', requireAdmin, adminController.getAllStores);
router.post('/admin/stores', requireAdmin , adminController.createStore);
router.put('/admin/stores/:id', requireAdmin, adminController.updateStore);
router.delete('/admin/stores/:id', requireAdmin, adminController.deleteStore);

module.exports = router;