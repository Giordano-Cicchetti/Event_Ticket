const passport = require('passport');
const bcryptjs = require('bcryptjs');
const multer  = require('multer');
const fs = require("fs");
const path = require('path');
var upload = multer({ storage: storage })
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
})

//const Role = require('../config/role');
//------------ User Model ------------//
//const User = require('../models/User');
const Event = require('../models/Event');

//------------ Create event Handle ------------//
exports.createEventHandle = (req, res) => {
    const { name, date, city, locale, img, descrizione, manager} = req.body;
    console.log(req);
    console.log(req.body);
    console.log(descrizione)
    
    const newEvent = new Event({
        name,
        descrizione,
        img,
        date,
        city,
        locale,
        manager
    });
    newEvent.save().then(user => {
        
        res.redirect('/profiloManager');
    })
    .catch(err => console.log(err));
    
    

}
exports.updateEventHandle = (req, res) => {

}
exports.showEventsHandle = (req, res) => {
    
}


exports.removeEventHandle = (req, res) => {

}







//------------ Register Handle ------------//
exports.registerHandle = (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    //------------ Checking required fields ------------//
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    //------------ Checking password mismatch ------------//
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    //------------ Checking password length ------------//
    if (password.length < 8) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //------------ Validation passed ------------//
        User.findOne({ email: email }).then(user => {
            if (user) {
                //------------ User already exists ------------//
                errors.push({ msg: 'Email ID already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }
            else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    newUser.role= Role.User

                    bcryptjs.genSalt(10, (err, salt) => {
                        bcryptjs.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    req.flash(
                                        'success_msg',
                                        'Account activated. You can now log in.'
                                    );
                                    res.redirect('/auth/login');
                                })
                                .catch(err => console.log(err));
                        });
                    });
            }
        });

    }
}





//------------ Login Handle ------------//
exports.loginHandle = (req, res, next) => {

    passport.authenticate('local', {
        //successRedirect: '/dashboard',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next) 
        

}

//------------ Logout Handle ------------//
exports.logoutHandle = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/auth/login');
}

exports.grantAuth = (req,res) => {
    if (req.isAuthenticated()) {
        res.status(200).send('Status: OK')
    }
    else {
        res.status(401).send('Status: KO')
    }
}