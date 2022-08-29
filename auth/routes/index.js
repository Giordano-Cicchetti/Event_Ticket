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
router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dash', {
    name: req.user.name
}));

router.get('/dashAdmin', ensureAuthenticated, (req, res) => res.render('dashAdmin', {
    name: req.user.name
}));

router.get('/dashManager', ensureAuthenticated, (req, res) => res.render('dashManager', {
    name: req.user.name
}));

router.get('/grant_Auth', authController.grantAuth);

router.get('/authorizeUser', (req, res) => authorize(Role.User,req,res));

router.get('/authorizeManager', (req, res) => authorize(Role.Manager,req,res));

router.get('/authorizeAdmin', (req, res) => authorize(Role.Admin,req,res));


module.exports = router;