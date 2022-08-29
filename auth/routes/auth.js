const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/checkAuth')

//------------ Importing Controllers ------------//
const authController = require('../controllers/authController')

//------------ Login Route ------------//
router.get('/login', (req, res) => res.render('login'));
router.get('/loginManager', (req, res) => res.render('loginManager'));
router.get('/loginAdmin', (req, res) => res.render('loginAdmin'));
//------------ Forgot Password Route ------------//
router.get('/forgot', (req, res) => res.render('forgot'));

//------------ Reset Password Route ------------//
router.get('/reset/:id', (req, res) => {
    // console.log(id)
    res.render('reset', { id: req.params.id })
});

//------------ Register Route ------------//
router.get('/register', (req, res) => res.render('register'));

//------------ Register POST Handle ------------//
router.post('/register', authController.registerHandle);

//------------ Email ACTIVATE Handle ------------//
router.get('/activate/:token', authController.activateHandle);

//------------ Forgot Password Handle ------------//
router.post('/forgot', authController.forgotPassword);

//------------ Reset Password Handle ------------//
router.post('/reset/:id', authController.resetPassword);

//------------ Reset Password Handle ------------//
router.get('/forgot/:token', authController.gotoReset);

//------------ Login POST Handle ------------//
router.post('/login', authController.loginHandle, 
    //funzione di callback
    function(req, res) {
        if(req.body.role=="User"){
            res.redirect("/dashboard");
        }
        else if(req.body.role=="Admin"){
            res.redirect("/dashAdmin");
        }
        else if(req.body.role=="Manager"){
            res.redirect("/dashManager")
        }
});

//------------ Logout GET Handle ------------//
router.get('/logout', authController.logoutHandle);



module.exports = router;