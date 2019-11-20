//server.js
const express       = require('express'),
      ejs           = require('ejs'),
      bodyParser    = require('body-parser'),
      mongoose      = require('mongoose'),
      passport      = require('passport'),
      LocalStrategy = require('passport-local'),
      User          = require('./models/user')
      Campground    = require('./models/campground'),
      Comment       = require('./models/comment'),
      methodOverride = require('method-override'),
      flash         = require('connect-flash'),
      port          = process.env.PORT || 8080,
      app           = express(),
      seedDB        = require('./seeds');

//requireing routes
const commentRoutes     = require('./routes/comments'),
      campgroundRoutes  = require('./routes/campgrounds'),
      indexRoutes       = require('./routes/index');

app.use(require('express-session')({
        secret: 'Kicia Kocia i Misio Pysio',
        resave: false,
        saveUninitialized: false
      }));

app.use(methodOverride('_method'));
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/yelpcamp_v12', {useNewUrlParser: true});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

//configure flash
app.use(flash());

//load css from public dir
app.use(express.static(__dirname +'/public'));
//console.log(__dirname);

//getting data form a form
app.use(bodyParser.urlencoded({extended:true}));

//own middleware that passess the logged in user to the page that is being rendered
app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  next();
});

app.use((req, res, next)=>{
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});
//so that I don't have to type .ejs extentntion in the rest of this app.js
app.set('view engine', 'ejs');

//seedDB(); //seed the database

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);

//NEAT!!!!
//eval(require('locus'));

app.listen(port, process.env.IP ()=>{
  console.log("Yelp server set up");
});
