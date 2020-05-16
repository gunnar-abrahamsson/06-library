const models = require('../models');
const { validationResult, matchedData } = require('express-validator')

const index = async (req, res) => {
	const all_users = await models.User.fetchAll();

	res.send({
		status: 'success',
		data: {
			Users: all_users
		}
	});
}

const show = async (req, res) => {
	// select * from users where id = 1
    const user = await models.User.where({ id: req.params.userId}).fetch({ withRelated: 'books' });

	res.send({
		status: 'success',
		data: {
			user,
		}
	});
}

const store = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
        })
    }

    const validData = matchedData(req);


    const storedUser = await new models.User(validData).save();
    console.log('new user: ', storedUser);
    res.send({
        status: 'success',
        data: storedUser
    })
}

// Put /:userId
const update = (req, res) => {
    res.status(405).send({
        status: 'success'
    })
}

// Destroy /:userId
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