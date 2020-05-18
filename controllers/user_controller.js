const { User } = require('../models');
const { validationResult, matchedData } = require('express-validator');
const bcrypt = require('bcrypt')

const index = async (req, res) => {

    console.log('req headers auth: ', req.headers.authorization)
    try{
        const all_users = await User.fetchAll();
    
        res.send({
            status: 'success',
            data: {
                Users: all_users
            }
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when trying to get all users from database'
        })
        throw error
    }
}

const show = async (req, res) => {
    try{
        // select * from users where id = 1
        const user = await User.where({ id: req.params.userId}).fetch({ withRelated: 'books' });
    
        res.send({
            status: 'success',
            data: {
                user,
            }
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when trying to get a user from database'
        })
        throw error
    }
}

const store = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
        })
        return;
    }

    const validData = matchedData(req);

    // generate a hash of validData.password
    try{
        validData.password = await bcrypt.hash(validData.password, User.hashSaltRounds);
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exeption thrown when hashing the password when creating the user'
        })
        throw error;
    }

    // set hash of validData.password to validData.password

    try {
        // const User.create(validData).save();
        const storedUser = await new User(validData).save();
        console.log('new user: ', storedUser);
        res.send({
            status: 'success',
            data: storedUser
        })
    }  catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when trying to store a user in the database'
        })
        throw error
    }
}

// Put /:userId
const update = async (req, res) => {
    const userId = req.params.userId;

    const user = await new User({ id: userId }).fetch({ require: false });

    if(!user) {
        console.log(`User with id: ${userId}, not found`)
        res.status(404).send({
            status: 'fail',
            data: `User with id: ${userId}, not found`
        })
        return;
    }
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
        })
        return;
    }

    const validData = matchedData(req);
    try{
        const updatedUser = await user.save(validData);
        console.log("Update user successufly:", updatedUser);
        res.status(405).send({
            status: 'success',
            data: {
                user: updatedUser,
            },
        })

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when trying to get all users from database'
        })
        throw error
    }
}

// Destroy /:userId
const destroy = async (req, res) => {
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