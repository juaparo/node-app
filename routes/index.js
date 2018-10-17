const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
// Error handler
const { catchErrors } = require('../handlers/errorHandlers');

// Get stores
router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

// add menu
router.get('/add', authController.isLoggedIn, storeController.addStore);

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
router.post('/login', authController.login)
router.get('/register', userController.registerForm);
//validate info of register form
router.post('/register', 
  userController.validateRegister,
  userController.register,
  authController.login
);

//LOG OUT ROUTES
router.get('/logout', authController.logout);

//ACCOUNT PROFILE
router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', authController.isLoggedIn, catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot)) ;
//reset password generating a token for that
router.get('/account/reset/:token', catchErrors(authController.reset))
//validate the passwords
router.post('/account/reset/:token', 
  authController.confirmedPasswords, 
  catchErrors(authController.update)
);

router.get('/map', storeController.mapPage);

/*
  API
*/

router.get('/api/search', catchErrors(storeController.searchStores));
router.get('/api/stores/near', catchErrors(storeController.mapStores));

//HEART STORES
router.post('/api/stores/:id/heart', catchErrors(storeController.heart))
router.get('/hearts', authController.isLoggedIn ,catchErrors(storeController.getHearts));

//REVIEWS ROUTES
router.post('/reviews/:id', authController.isLoggedIn, catchErrors(reviewController.addReview));

//TOP PAGE ROUTES
router.get('/top', catchErrors(storeController.getTopStores));

module.exports = router;
