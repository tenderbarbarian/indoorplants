const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
	name: String,
	price: String,
	image: String,
	description: String,
	light: String,
	water: String,
	soil: String,
	difficulty: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	],
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	}
});

//compiling schema into a model
module.exports = mongoose.model('Plant', plantSchema);
