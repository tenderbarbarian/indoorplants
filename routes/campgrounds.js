const express     = require('express');
const router      = express.Router();
const middleware  = require('../middleware');

//INDEX route - show camps
router.get('/', (req, res)=> {
  //console.log(req.user);
  Campground.find()
    .then((allCampgrounds)=>{
      res.render('./campgrounds/index', {campgrounds:allCampgrounds});
    })
    .catch((err)=>{
      console.log('Cannot pull from the DB :(');
    });
});

//NEW route -show form
router.get('/new', middleware.isLoggedIn, (req, res)=>{
  res.render('./campgrounds/new');
});

//CREATE (POST) route - add to DB and redirect (display campgrounds again)
router.post('/', middleware.isLoggedIn, (req, res)=>{
  //res.send('You hit the post route');
  const campgroundName = req.body.name;
  const campgroundImage = req.body.image;
  const campgroundDescription = req.body.description;
  const campgroundPrice = req.body.price;
  const author = {
    id: req.user._id,
    username: req.user.username
  };
  Campground.create({
    name: campgroundName,
    image: campgroundImage,
    price: campgroundPrice,
    description: campgroundDescription,
    author: author
  })
    .then((newCamp)=>{
      console.log("Woohoo! added to the DB:");
      //console.log(newCamp);
    })
    .catch((err)=>{
      console.log('Upps couldn\'t add to the DB');
    });

  res.redirect('/campgrounds');
});

// SHOW ROUTE
router.get('/:id', (req, res)=>{
  //Finding campgrounds, id == req.params.id, instad of references, pull comment objects (populate.exec)
  Campground.findById(req.params.id).populate('comments').exec()
    .then((foundCampground)=>{
      //console.log(foundCampground);
      res.render('./campgrounds/show', {campground: foundCampground});
    })
    .catch((err) =>{
      res.send('Sorry no such camp');
    });
  //res.render('show');
});

//EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id)
        .then((campground)=>{
            res.render('./campgrounds/edit', {campground: campground});
        })
        .catch((err)=>{
          console.log("Find by ID crashed. "+err);
        });

});

//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res)=>{

  Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    .then((updatedCampground)=>{
      req.flash('success', 'Successfully updated campground.');
      res.redirect('/campgrounds/'+req.params.id);
    })
    .catch((err)=>{
      res.redirect('/campgrounds');
      console.log("ERROR updating camp "+err);
    });
});

//DESTROY ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
  Campground.findByIdAndRemove(req.params.id)
      .then(()=>{
        req.flash('success', 'Campground deleted.');
        res.redirect('/campgrounds');
      })
      .catch((error)=>{
        console.log("cannot delete campground "+error);
        res.redirect('/campgrounds/'+req.params.id);
      });

});

module.exports = router;
