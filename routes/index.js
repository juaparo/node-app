const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
// Error handler
const { catchErrors } = require('../handlers/errorHandlers');

// Get stores
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

// add menu
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));

router.get('/store/:id/edit', catchErrors(storeController.editStore));

module.exports = router;
