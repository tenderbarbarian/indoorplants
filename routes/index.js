const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const middleware = require('../middleware');

//index
router.get('/', (req, res) => {
	res.render('./landing');
});

//===============================
//AUTH ROUTES
// =================================

//show register form
router.get('/register', (req, res) => {
	res.render('./register');
});

//sign up logic
router.post('/register', (req, res) => {
	const newUser = new User({ username: req.body.username });
	console.log('sign up logic');
	User.register(newUser, req.body.password)
		.then((user) => {
			passport.authenticate('local')(req, res, () => {
				req.flash('success', 'Welcome to IndoorPlants ' + user.username);
				console.log('welcome! ' + user.username);
				return res.redirect('/plants');
			});
		})
		.catch((error) => {
			req.flash('error', error.message);
			console.log('SIGN UP ERR' + error.message);
			res.redirect('register');
		});
	/*
      User.register(newUser, req.body.password, (error, user)=>{
        if(error){
          req.flash('error', error.message); //DOEST WORK :(
          console.log('SIGN UP ERR'+ error.message);
          return res.render('register');
          }
            passport.authenticate('local')(req, res, ()=>{
              req.flash('success', 'Welcome to IndoorPlant '+ user.username );
              console.log('welcome! '+ user.username);
              res.redirect('/plants');
            });
      });*/
});

//show login form
router.get('/login', (req, res) => {
	res.render('login');
});

//login logic
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/plants',
		failureRedirect: '/login',
		failureFlash: true
	}),
	(req, res) => {}
);

//logout logic
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success', 'Successfully logged out');
	res.redirect('/plants');
});

module.exports = router;
