const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');
const passport  = require('passport');
const LocalStrategy = require('passport-local');
const middleware = require('../middleware');

//index
router.get('/', (req, res)=> {
  res.render('./landing');
});

//===============================
//AUTH ROUTES
// =================================

//show register form
router.get('/register', (req, res)=>{
  res.render('./register');
});

//sign up logic
router.post('/register', (req, res)=>{
  const newUser = new User({username:req.body.username});
  console.log('sign up logic');
  User.register(newUser, req.body.password)
      .then((user)=>{
        passport.authenticate('local')(req, res, ()=>{
          req.flash('success', 'Welcome to YelpCamp '+ user.username );
          console.log('welcome! '+ user.username);
          return res.redirect('/campgrounds');
        });
      })
      .catch((error)=>{
        req.flash('error', error.message); //DOEST WORK :(
        console.log('SIGN UP ERR'+ error.message);
        res.render('register');
      });
      /*
      User.register(newUser, req.body.password, (error, user)=>{
        if(error){
          req.flash('error', error.message); //DOEST WORK :(
          console.log('SIGN UP ERR'+ error.message);
          return res.render('register');
          }
            passport.authenticate('local')(req, res, ()=>{
              req.flash('success', 'Welcome to YelpCamp '+ user.username );
              console.log('welcome! '+ user.username);
              res.redirect('/campgrounds');
            });
      });*/
});

//show login form
router.get('/login', (req, res)=>{
  res.render('login');
});

//login logic
router.post('/login',
        passport.authenticate('local', {
                                        successRedirect: '/campgrounds',
                                        failureRedirect: '/login'
                              }),
        (req, res)=>{
        //console.log();
});

//logout logic
router.get('/logout', (req, res)=>{
   req.logout();
   req.flash('success', 'Successfully logged out');
   res.redirect('/campgrounds');
});

module.exports = router;
