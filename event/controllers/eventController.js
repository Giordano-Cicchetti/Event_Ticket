const passport = require('passport');
const bcryptjs = require('bcryptjs');
const multer  = require('multer');
const fs = require("fs");
const path = require('path');
const https = require('http');
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
    const { name, date, city, locale, img, descrizione, categoria, tipo,num_bigl,prezzo_bigl,manager} = req.body;
    console.log(req);
    console.log(req.body);
    console.log(descrizione);
    let prezzo= prezzo_bigl;
    let bigl_rimanenti=num_bigl;
    

    const newEvent = new Event({
        name,
        descrizione,
        img,
        date,
        city,
        locale,
        manager,
        categoria,
        num_bigl,
        prezzo,
        tipo,
        bigl_rimanenti
        
    });
    newEvent.save().then(user => {
      const options = {
        hostname: 'rabbit_producer',
        port: 8081,
        path: '/produce?interest='+categoria+"&name_event="+encodeURIComponent(name),
        method: 'GET',
      };
      const requ = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
      
        res.on('data', d => {
          console.log(d);
        });
      });
      
      requ.on('error', error => {
        console.error(error);
      });
      
      requ.end();
      


      res.redirect('/profiloManager');
    })
    .catch(err => console.log(err));



    //codice o chiamata rabbitmq per notificare
    
    

}
exports.updateEventHandle = (req, res) => {

}


exports.showEventsHandle = (req, res) => {
  
    let tipo_ticket=req.query.event_type;
    let cate=req.query.event_categ;
    var cutoff = new Date();
    let name= req.query.name;
    let email= req.query.email;
    let role= req.query.role;
    if (req.query.event_type == "Biglietto" || req.query.event_type == "Prevendita" || req.query.event_type == "Informativo"){
        //MongoClient.connect(url, function(err, db) {
          //if (err) throw err;
          //var dbo = db.db("eventi_db");
          var q = {tipo:tipo_ticket,date: {$gte: cutoff}}
          //dbo.collection("eventi").
          Event.find(q).then(events=>{//toArray(function(err, r){
              //if (err) throw err;
              //db.close();
              console.log(events);
              var r=events;
              var dimens = r.length;
              
              if (dimens===0){
                
                //dbo.collection("eventi").
                Event.find().then(events=>{//toArray(function(err, r){

                  //if (err) throw err;
                  //db.close();
                  var r=events
                  dimens = r.length;
                  a = []
                  for (i=0; i<dimens;i++){
                    a.push(r[i]._id.toString())
                  }
                  res.render('events', {r, dimens, a, name, email, role})
                  
                })
              }
              else{
                a = []
                for (i=0; i<dimens;i++){
                  a.push(r[i]._id.toString())
                }
                res.render('events', {r, dimens, a, name , email,role})
              }
          })
      //}.bind({tipo:req.query.event_type}));
    }
    else{
        if(req.query.event_categ){
          //console.log(req.query.event_categ);
          //MongoClient.connect(url, function(err, db) {
            //if (err) throw err;
            //var dbo = db.db("eventi_db");
            var q = {categoria:cate , date: {$gte: cutoff}}
            //dbo.collection("eventi").
            Event.find(q).then(events=>{//toArray(function(err, r){
                //if (err) throw err;
                //db.close();
                r=events;
                var dimens = events.length;
                
                if (dimens===0){
                  
                  //dbo.collection("eventi").
                  Event.find().then(events=>{//toArray(function(err, r){
                    //if (err) throw err;
                    //db.close();
                    var r=events;
                    dimens = r.length;
                    a = []
                    for (i=0; i<dimens;i++){
                      a.push(r[i]._id.toString())
                    }
                    res.render('events', {r, dimens, a, name, email,role})
                    
                  })
                }
                else{
                  a = []
                  for (i=0; i<dimens;i++){
                    a.push(r[i]._id.toString())
                  }
                  res.render('events', {r, dimens, a, name , email,role})
                }
            })
        //}.bind({cate:req.query.event_categ}));
        }
        else{
              //MongoClient.connect(url, function(err, db) {
                //if (err) throw err;
                //var dbo = db.db("eventi_db");
                //dbo.collection("eventi").
                Event.find().then(events=>{//toArray(function(err, r){
                    //if (err) throw err;
                    //db.close();
                    var r=events;
                    var dimens = r.length;
                    a = []
                    for (i=0; i<dimens;i++){
                      a.push(r[i]._id.toString())
                    }
                    res.render('events', {r, dimens, a, name, email,role})
                });
              //});
        }
    }
      
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