const { User } = require('../models');
const { validationResult, matchedData } = require('express-validator')

// get a users profile
const getProfile = async (req, res) => {

    if (!req.user) {
        res.status(401).send({
            status: 'fail',
            data: 'Authentication is required'
        });
        return;
    }

    // const user = {
    //     username: req.user.username,
    //     id: req.user.id,
    //     first_name: req.user.first_name,
    //     last_name: req.user.last_name,
    // }
    try{
        res.send({
            status: 'success',
            data: {
                user: req.user,
            }
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when trying to get all users from database'
        });
        throw error
    }
}

//get the authenticated users books
const getBooks = async (req, res) => {
    if (!req.user) {
        res.status(401).send({
            status: 'fail',
            data: 'Authentication is required'
        });
        return;
    }
    try{
        //get all books for a profile
        const books = await req.user.related('books').fetch();
        res.send({
            status: 'success',
            data: books
        });
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when trying to get profile books from database'
        });
        throw error
    }
}

// Put update authorized profile
const updateProfile = async (req, res) => {
    //check if user is loged in
    if(!req.user) {
        res.status(401).send({
            status: 'fail',
            data: 'Authentication is required'
        });
        return;
    }
    const errors = validationResult(req)

    //check or errors in req
    if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
        });
        return;
    }

    //get valid data
    const validData = matchedData(req);
    try{
        const updateProfiledUser = await req.user.save(validData);
        console.log("UpdateProfile user successufly:", updateProfiledUser);
        res.send({
            status: 'success',
            data: updateProfiledUser,
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when trying to update profile'
        });
        throw error
    }
}

module.exports = {
    getProfile,
    getBooks,
    updateProfile,
}