//server.js
const express = require('express'),
	ejs = require('ejs'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	User = require('./models/user');
(Plant = require('./models/plant')),
	(Comment = require('./models/comment')),
	(methodOverride = require('method-override')),
	(flash = require('express-flash')),
	(app = express()),
	(databaseLink = process.env.DATABASEURL || 'mongodb://localhost/indoorplants_v1'), //set up my own environment variable for DB
	(port = process.env.PORT || 3000),
	(seedDB = require('./seeds'));

//requireing routes
const commentRoutes = require('./routes/comments'),
	plantRoutes = require('./routes/plants'),
	indexRoutes = require('./routes/index');

app.use(
	require('express-session')({
		secret: 'Kicia Kocia i Misio Pysio',
		resave: false,
		saveUninitialized: false
	})
);

app.use(methodOverride('_method'));
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//mongoose.connect('mongodb://localhost/yelpcamp_v12', {useNewUrlParser: true});
//mongoose.connect('mongodb+srv://kasia:malami@cluster0-nwkut.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});

mongoose.connect(databaseLink, { useNewUrlParser: true });

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

//configure flash
app.use(flash());

//load css from public dir
app.use(express.static(__dirname + '/public'));
//console.log(__dirname);

//getting data form a form
app.use(bodyParser.urlencoded({ extended: true }));

//own middleware that passess the logged in user to the page that is being rendered
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use((req, res, next) => {
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});
//so that I don't have to type .ejs extentntion in the rest of this app.js
app.set('view engine', 'ejs');

//seedDB(); //seed the database

app.use(indexRoutes);
app.use('/plants/:id/comments', commentRoutes);
app.use('/plants', plantRoutes);

//NEAT!!!!
//eval(require('locus'));

//app.listen(3000, ()=>{
//app.listen(port, ()=>{
app.listen(port, () => {
	console.log('Plant server set up');
});
