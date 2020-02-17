const mongoose = require('mongoose');
const Plant = require('./models/plant');
const Comment = require('./models/comment');

const data = [
	{
		name: 'Yellowstone',
		image:
			'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1549&q=80',
		description:
			'Compiling your first model. When you call mongoose.model() on a schema, Mongoose compiles a model for you. Constructing Documents. An instance of a model is called a document. Querying. Deleting. Updating. Change Streams. Yet more. '
	},
	{
		name: 'White River',
		image:
			'https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjE2ODQ0fQ&auto=format&fit=crop&w=1559&q=80',
		description:
			'In this article, we will discuss how to use the mongoose deleteMany() method to delete multiple documents.'
	},
	{
		name: 'Red Rock',
		image:
			'https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',
		description:
			"Not really sure how to pass this challenge, I feel like, i've tried many combinations already Any guides or examples appreciated "
	}
];

function seedDB() {
	//remove all plants
	Plant.deleteMany()
		.then(() => {
			console.log('removed plants!');
			//then add new ones
			/*Plant.create(data)
        .then((dataEL) => {
          console.log('success');
          dataEL.forEach((entry) => {
            Comment.create({
                text: 'Blach comment blah',
                author: 'homer'
              }).then((comment) => {
                  entry.comments.push(comment);
                  entry.save();
                  //console.log(entry.name + " comments: " + entry.comments);
                })
                .catch((err) => {
                  //console.log('sth wrong with creating a comment' + err);
                });
          });
        })
        .catch((e) => {
          console.log(e);
        });
        */
		})
		.catch((err) => {
			console.log("couldn't remove " + err);
		});
}

module.exports = seedDB;
