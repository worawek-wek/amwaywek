const express = require('express');
const router = express.Router();
const validate = require('../utilities/validate');
const { authenticateJWT } = require('../middleware/admin');


const IndexController = require('../controllers-backend/IndexController');
const AdminController = require('../controllers-backend/AdminController');
const UserController = require('../controllers-backend/UserController');
const BannerController = require('../controllers-backend/BannerController');
const CategoryController = require('../controllers-backend/CategoryController');


// IndexController
router.get('/', IndexController.index);

// Auth
router.post('/auth/login', AdminController.login);
router.post('/auth/me', authenticateJWT, AdminController.me);
router.post('/auth/logout', authenticateJWT, AdminController.logout);


// AdminController
router.post('/admin', authenticateJWT, AdminController.create);
router.post('/admin/data-table', authenticateJWT, AdminController.findAll);
router.put('/admin/:id', validate('id'), authenticateJWT, AdminController.update);
router.get('/admin/:id', validate('id'), authenticateJWT, AdminController.findOne);
router.delete('/admin/:id', validate('id'), authenticateJWT, AdminController.delete);
router.post('/admin/:id/status', validate('id'), authenticateJWT, AdminController.status);

// UserController
router.post('/user', authenticateJWT, UserController.create);
router.post('/user/data-table', authenticateJWT, UserController.findAll);
router.put('/user/:id', validate('id'), authenticateJWT, UserController.update);
router.get('/user/:id', validate('id'), authenticateJWT, UserController.findOne);
router.delete('/user/:id', validate('id'), authenticateJWT, UserController.delete);
router.post('/user/:id/status', validate('id'), authenticateJWT, UserController.status);

// BannerController
router.post('/banner', authenticateJWT, BannerController.create);
router.post('/banner/data-table', BannerController.findAll);
// router.post('/banner/data-table', authenticateJWT, BannerController.findAll);
router.put('/banner/:id', validate('id'), authenticateJWT, BannerController.update);
router.get('/banner/:id', validate('id'), BannerController.findOne);
router.get('/banner/:id', validate('id'), authenticateJWT, BannerController.findOne);

router.delete('/banner/:id', validate('id'), authenticateJWT, BannerController.delete);
router.post('/banner/:id/status', validate('id'), authenticateJWT, BannerController.status);

// CategoryController
router.post('/category', authenticateJWT, CategoryController.validate('form'), CategoryController.create);
router.post('/category/data-table', authenticateJWT, CategoryController.findAll);
router.put('/category/:id', validate('id'), CategoryController.validate('form'), authenticateJWT, CategoryController.update);
router.get('/category/:id', validate('id'), authenticateJWT, CategoryController.findOne);
router.delete('/category/:id', validate('id'), authenticateJWT, CategoryController.delete);
router.post('/category/:id/status', validate('id'), authenticateJWT, CategoryController.status);

module.exports = router;
