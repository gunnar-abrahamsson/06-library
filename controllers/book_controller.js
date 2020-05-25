const { Book } = require('../models');

// Get /
const index = async (req, res) => {
	// const all_books = await Book.fetchAll();
	const all_books = await new Book({}).fetchAll();

	res.send({
		status: 'success',
		data: {
			books: all_books
		}
	});
}

// Get /:bookId
const show = async (req, res) => {
    // select * from books where id = 1
    try {
        const book = await Book.where({ id: req.params.bookId}).fetch({ withRelated: ['author'] });
        res.send({
            status: 'success',
            data: {
                book,
            }
        });

    } catch (err) {
        res.send(404).send({
            status: 'fail',
            data: 'No book found'
        })
        throw err;
    }
	// const book = await Book.findByPk(req.params.bookId);

}

// Post /
const store = (req, res) => {
    res.status(405).send({
        status: 'success'
    })
}

// Put /:bookId
const update = (req, res) => {
    res.status(405).send({
        status: 'success'
    })
}

// Destroy /:bookId
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