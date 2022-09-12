const express = require('express');
const router = express.Router();
const validate = require('../utilities/validate');
const { authenticateJWT } = require('../middleware/auth');


const IndexController = require('../controllers/IndexController');
const UserController = require('../controllers/UserController');


// IndexController
router.get('/', IndexController.index);
// Auth
router.post('/auth/login', UserController.login);
router.post('/auth/me', authenticateJWT, UserController.me);
router.post('/auth/logout', authenticateJWT, UserController.logout);


module.exports = router;