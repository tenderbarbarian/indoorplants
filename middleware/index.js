//const passport = require('passport');
const middlewareOBJ = {};

middlewareOBJ.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'You need to be logged in to do that.');
	res.redirect('/login');
};

middlewareOBJ.checkCommentOwnership = function(req, res, next) {
	console.log(req);
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id)
			.then((foundComment) => {
				if (foundComment.author.id.equals(req.user._id)) {
					return next();
				}
				res.redirect('back');
			})
			.catch((err) => {
				res.redirect('back');
			});
	} else {
		req.flash('error', 'You are not authorized to do that.');
		res.redirect('back');
	}
};

middlewareOBJ.checkPlantOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Plant.findById(req.params.id)
			.then((plant) => {
				//does user own the plant?
				if (plant.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash('error', 'You are not authorized to do that.');
					res.redirect('back');
				}
			})
			.catch((err) => {
				req.flash('error', 'Plant not found.');
				res.redirect('back');
			});
	} else {
		req.flash('error', 'You are not authorized to do that.');
		res.redirect('back');
	}
};

module.exports = middlewareOBJ;
