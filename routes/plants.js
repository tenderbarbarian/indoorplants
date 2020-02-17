const express = require('express');
const router = express.Router();
const middleware = require('../middleware');

//INDEX route - show plants
router.get('/', (req, res) => {
	//console.log(req.user);
	Plant.find()
		.then((allPlants) => {
			res.render('./plants/index', { plants: allPlants });
		})
		.catch((err) => {
			console.log('Cannot pull from the DB :(');
		});
});

//NEW route -show form
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('./plants/new');
});

//CREATE (POST) route - add to DB and redirect (display plants again)
router.post('/', middleware.isLoggedIn, (req, res) => {
	//res.send('You hit the post route');
	const plantName = req.body.name;
	const plantImage = req.body.image;
	const plantDescription = req.body.description;
	const plantPrice = req.body.price;
	const author = {
		id: req.user._id,
		username: req.user.username
	};
	Plant.create({
		name: plantName,
		image: plantImage,
		price: plantPrice,
		description: plantDescription,
		author: author
	})
		.then((newPlant) => {
			console.log('Woohoo! added to the DB:');
			//console.log(newPlant);
		})
		.catch((err) => {
			console.log("Upps couldn't add to the DB");
		});

	res.redirect('/plants');
});

// SHOW ROUTE
router.get('/:id', (req, res) => {
	//Finding plants, id == req.params.id, instead of references, pull comment objects (populate.exec)
	Plant.findById(req.params.id)
		.populate('comments')
		.exec()
		.then((foundPlant) => {
			//console.log(foundPlant);
			res.render('./plants/show', { plant: foundPlant });
		})
		.catch((err) => {
			res.send('Sorry no such plant');
		});
	//res.render('show');
});

//EDIT plant ROUTE
router.get('/:id/edit', middleware.checkPlantOwnership, (req, res) => {
	Plant.findById(req.params.id)
		.then((plant) => {
			res.render('./plants/edit', { plant: plant });
		})
		.catch((err) => {
			console.log('Find by ID crashed. ' + err);
		});
});

//UPDATE plant ROUTE
router.put('/:id', middleware.checkPlantOwnership, (req, res) => {
	Plant.findByIdAndUpdate(req.params.id, req.body.plant)
		.then((updatedPlant) => {
			req.flash('success', 'Successfully updated plant.');
			res.redirect('/plants/' + req.params.id);
		})
		.catch((err) => {
			res.redirect('/plants');
			console.log('ERROR updating plant ' + err);
		});
});

//DESTROY ROUTE
router.delete('/:id', middleware.checkPlantOwnership, (req, res) => {
	Plant.findByIdAndRemove(req.params.id)
		.then(() => {
			req.flash('success', 'Plant deleted.');
			res.redirect('/plants');
		})
		.catch((error) => {
			console.log('Cannot delete plant ' + error);
			res.redirect('/plants/' + req.params.id);
		});
});

module.exports = router;
