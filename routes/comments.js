const express     = require('express');
const router      = express.Router({mergeParams:true});
const Campground  = require('../models/campground');
const Comment     = require('../models/comment');
const middleware  = require('../middleware');

//Add a new comment
router.get('/new', middleware.isLoggedIn, (req, res)=>{
  //res.send('New comment form');
  Campground.findById(req.params.id)
      .then((camp)=>{
        res.render('./comments/new', {campground: camp});
      })
      .catch((err)=>{});
});

//Edit a new comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res)=>{
  /*Campground.findById(req.params.id)
      .then((camp)=>{
        Comment.findById(req.params.comment_id)
            .then((comment)=>{
              res.render('./comments/edit', {comment: comment, campground: camp});
            })
            .catch((err)=>{
              console.log('edit comment route err_2: '+err);
            });
      })
      .catch((err)=>{
        console.log('edit comment route err: '+err);
      });
      */
      Comment.findById(req.params.comment_id)
                .then((comment)=>{
                  res.render('./comments/edit', {comment: comment, campground_id: req.params.id});
                })
                .catch((err)=>{
                  console.log('edit comment route err_2: '+err);
                  res.redirect('back');
                });
});

//COMMENTS CREATE add comment to the DB
router.post('/', middleware.isLoggedIn, (req, res)=>{
  console.log(req.params.id);
  Campground.findById(req.params.id)
            .then((campground)=>{
              Comment.create(req.body.comment)
                      .then((newComment)=>{
                        //add username & id to comment
                        newComment.author = {username:req.user.username, id:req.user._id};
                        newComment.save();
                        //console.log(newComment);
                        campground.comments.push(newComment);
                        campground.save()
                                  .then((updatedCampground)=>{
                                    //console.log("Saved to DB"+updatedCampground);
                                    res.redirect('/campgrounds/'+campground._id);
                                  })
                                  .catch((error)=>{
                                    console.log("Comment lost: "+error);
                                  });
                      })
                      .catch((err)=>{
                        console.log('Creating failed '+err);
                        res.redirect('/campgrounds/');
                      });
            })
            .catch((e)=>{
              console.log('Could not find campground: '+e);
              res.redirect('/campgrounds/');
            });
  //redirect - display page with comments
//  res.redirect('/campgrounds/'+req.params.id);
});

//UPDATE comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
            Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
                    .then((updatedComment)=>{
                      req.flash('success', 'Successfully updated comment.');
                      res.redirect('/campgrounds/'+req.params.id);
                    })
                    .catch((err)=>{
                      console.log('Updating comment failed, err: '+err);
                      res.redirect('back');
                    });
});

// DESTROY comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res)=>{
  Comment.findByIdAndRemove(req.params.comment_id)
      .then(()=>{
        req.flash('success', 'Comment deleted.');
        res.redirect('/campgrounds/'+req.params.id);
      })
      .catch((error)=>{

      });
});

module.exports = router;
