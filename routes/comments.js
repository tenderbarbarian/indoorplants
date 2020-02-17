const express = require('express');
const router = express.Router({ mergeParams: true });
const Plant = require('../models/plant');
const Comment = require('../models/comment');
const middleware = require('../middleware');

//Add a new comment
router.get('/new', middleware.isLoggedIn, (req, res) => {
	//res.send('New comment form');
	Plant.findById(req.params.id)
		.then((foundPlant) => {
			res.render('./comments/new', { plant: foundPlant });
		})
		.catch((err) => {});
});

//Edit a new comment
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
	/*Plant.findById(req.params.id)
      .then((foundPlant)=>{
        Comment.findById(req.params.comment_id)
            .then((comment)=>{
              res.render('./comments/edit', {comment: comment, plant: foundPlant});
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
		.then((comment) => {
			res.render('./comments/edit', { comment: comment, plant_id: req.params.id });
		})
		.catch((err) => {
			console.log('edit comment route err_2: ' + err);
			res.redirect('back');
		});
});

//COMMENTS CREATE add comment to the DB
router.post('/', middleware.isLoggedIn, (req, res) => {
	console.log(req.params.id);
	Plant.findById(req.params.id)
		.then((plant) => {
			Comment.create(req.body.comment)
				.then((newComment) => {
					//add username & id to comment
					newComment.author = { username: req.user.username, id: req.user._id };
					newComment.save();
					//console.log(newComment);
					plant.comments.push(newComment);
					plant
						.save()
						.then((updatedPlant) => {
							//console.log("Saved to DB"+updatedPlant);
							res.redirect('/plants/' + plant._id);
						})
						.catch((error) => {
							console.log('Comment lost: ' + error);
						});
				})
				.catch((err) => {
					console.log('Creating failed ' + err);
					res.redirect('/plants/');
				});
		})
		.catch((e) => {
			console.log('Could not find plant: ' + e);
			res.redirect('/plants/');
		});
	//redirect - display page with comments
	//  res.redirect('/plants/'+req.params.id);
});

//UPDATE comment
router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment)
		.then((updatedComment) => {
			req.flash('success', 'Successfully updated comment.');
			res.redirect('/plants/' + req.params.id);
		})
		.catch((err) => {
			console.log('Updating comment failed, err: ' + err);
			res.redirect('back');
		});
});

// DESTROY comment
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id)
		.then(() => {
			req.flash('success', 'Comment deleted.');
			res.redirect('/plants/' + req.params.id);
		})
		.catch((error) => {
			req.flash('error', 'Cannot delete comment.');
		});
});

module.exports = router;
