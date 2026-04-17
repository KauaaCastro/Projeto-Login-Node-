const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');
const redefController = require('../controllers/redefController');
const registerController = require('../controllers/registerController');
const dashboard = require('../controllers/dashboard');

router.get('/', loginController.renderLogin);
router.post('/', loginController.login);

router.post('/verify-email', redefController.verifyEmail);
router.post('/verify-code', redefController.verifyCode); 
router.post('/redefPassword', redefController.redefPassword);

router.get('/registerScreen', registerController.registerScreen); 
router.post('/registerPreview', registerController.registerPreview); 
router.post('/confirmRegistration', registerController.confirmRegister); 

router.get('/dashboard', dashboard.randerDashboard);
router.post('/createFolder', dashboard.createFolder);
router.post('/excludeFolders', dashboard.excludeFolders);
router.post('/createCard', dashboard.createCard);

module.exports = router;