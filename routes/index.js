const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
// Error handler
const { catchErrors } = require('../handlers/errorHandlers');

// Get stores
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

// add menu
router.get('/add', storeController.addStore);

router.post('/add', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.createStore)
);
router.post('/add/:id', 
  storeController.upload,
  catchErrors(storeController.resize),
  catchErrors(storeController.updateStore));
router.get('/stores/:id/edit', catchErrors(storeController.editStore));

//store by slug - single stores
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

// TAGS PAGE ROUTES
router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));


//LOGIN PAGE ROUTES
router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);
//validate info of register form
router.post('/register', 
  userController.validateRegister,
  userController.register,
  authController.login
);

module.exports = router;
