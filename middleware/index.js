//const passport = require('passport');
const middlewareOBJ = {};

middlewareOBJ.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'You need to be logged in to do that.');
  res.redirect('/login');
};

middlewareOBJ.checkCommentOwnership = function(req, res, next){
  console.log(req);
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id)
        .then((foundComment)=>{
          if(foundComment.author.id.equals(req.user._id)){
            return next();
          }
          console.log('eeeeee1');
          res.redirect('back');
        })
        .catch((err)=>{
          console.log('eeeeeeeeeee2');
          res.redirect('back');
        });
  }else{
    req.flash('error', 'You are not authorised to do that.');
    res.redirect('back');
  }
}

middlewareOBJ.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id)
        .then((campground)=>{
          //does user own the campground?
          if(campground.author.id.equals(req.user._id)){
            next();
          } else{
            req.flash('error','You are not authorised to do that.');
            res.redirect('back');
          }
        })
        .catch((err)=>{
          req.flash('error', "Campground not found.");
          res.redirect('back');
        });
  }else{
    req.flash('error','You are not authorised to do that.');
    res.redirect('back');
  }
}

module.exports = middlewareOBJ;
