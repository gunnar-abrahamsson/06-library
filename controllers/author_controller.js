const models = require('../models');

const index = async (req, res) => {
	const all_authors = await new models.Author({}).fetchAll();

	res.send({
		status: 'success',
		data: {
			Author: all_authors
		}
	});
}

const show = async (req, res) => {
	// select * from authors where id = 1
    const author = await models.Author.where({ id: req.params.authorId}).fetch({ withRelated: 'books' });

	res.send({
		status: 'success',
		data: {
			author,
		}
	});
} 

// Post /
const store = (req, res) => {
    res.status(405).send({
        status: 'success'
    })
}

// Put /:authorId
const update = (req, res) => {
    res.status(405).send({
        status: 'success'
    })
}

// Destroy /:authorId
const destroy = (req, res) => {
    res.status(405).send({
        status: 'success'
    })
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy,
}