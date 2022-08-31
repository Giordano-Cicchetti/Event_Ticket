const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')

const authController = require('../controllers/authController')
const { authorize } = require('../config/authorize')

const Role = require('../config/role');
//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    res.render('welcome');
});

//------------ Dashboard Route ------------//
router.get('/profiloUser', ensureAuthenticated, (req, res) => res.render('profiloUser', {
    name: req.user.name
}));

router.get('/profiloAdmin', ensureAuthenticated, (req, res) => res.render('profiloAdmin', {
    name: req.user.name
}));

router.get('/profiloManager', ensureAuthenticated, (req, res) => res.render('profiloManager', {
    name: req.user.name
}));

router.get('/grant_Auth', authController.grantAuth);

router.get('/authorizeUser', (req, res) => authorize(Role.User,req,res));

router.get('/authorizeManager', (req, res) => authorize(Role.Manager,req,res));

router.get('/authorizeAdmin', (req, res) => authorize(Role.Admin,req,res));


module.exports = router;