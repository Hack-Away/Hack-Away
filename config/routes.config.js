const express = require('express');
const router = express.Router();

const userController = require('../controllers/user.controller')

router.get('/', userController.register);

router.get('/users/new', (req, res, next) => {
    res.render('users/new');
});



module.exports = router;