const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller')

router.get('/', (req, res, next) => {
    res.render('home');
});

router.get('/users/new', userController.register);
router.post('/users/new', userController.doRegister);
router.get('/users/login', userController.login);
router.post('/users/login', userController.doLogin);
//router.get('/users/profile', userController.profile);




module.exports = router;