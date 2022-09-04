const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')
const { ensureAdmin } = require('../config/checkAuth')
const { ensureManager} = require('../config/checkAuth')
const { ensureUser } = require('../config/checkAuth')
const authController = require('../controllers/authController')
const { authorize } = require('../config/authorize')

const Role = require('../config/role');
//------------ Welcome Route ------------//
router.get('/', (req, res) => {
    
    res.render('welcome');
});

router.get('/navbar', (req, res) => {
    console.log(req);
    if (req.isAuthenticated()) {
        res.render('navbar',{name: req.user.name});
    }
    else{ 
        res.render('navbar');
    }
    
});

//------------ Dashboard Route ------------//
router.get('/profiloUser', ensureUser ,  (req, res) => res.render('profiloUser', {
    name: req.user.name
}));

router.get('/profiloAdmin', ensureAdmin, (req, res) => res.render('profiloAdmin', {
    name: req.user.name
}));

router.get('/profiloManager', ensureManager, (req, res) => res.render('profiloManager', {
    name: req.user.name
}));

router.get('/grant_Auth', authController.grantAuth);

router.get('/authorizeUser', (req, res) => authorize(Role.User,req,res));

router.get('/authorizeManager', (req, res) => authorize(Role.Manager,req,res));

router.get('/authorizeAdmin', (req, res) => authorize(Role.Admin,req,res));



module.exports = router;