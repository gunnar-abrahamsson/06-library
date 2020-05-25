const { User, Book } = require('../models');
const { validationResult, matchedData } = require('express-validator');

// get a users profile
const getProfile = async (req, res) => {

    let user;
    try{
        user = await User.fetchById(req.user.data.id);
    } catch (error) {
        res.sendStatus(404);
        throw error
    }

    // send part of profile to requester
    res.send({
        status: 'success',
        data: {
            user: {
                username: user.get('username'),
                first_name: user.get('first_name'),
                last_name: user.get('last_name'),
            },
        }
    });
}

/**
 * add a book to a users profile
 */

const addBook = async (req, res) => {
    // 0. get book id that we want to add
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
        })
        return;
    }

    const validData = matchedData(req);
    const bookId = validData.book_id;

    // 1. make sure book that we want actually exists
    try{
        const book = await Book.fetchById(bookId);
        // 2. attach book to user (create a row in books_users for this book and user)
        
        // 2.1 fetch User model
        const user = await User.fetchById(req.user.data.id);

        // check if user allready has a relation to that book
    
        // 2.2 on User model, call attach on the books() relation and pass the Book bodel
        const result = await user.books().attach(book);
        // 3. return 201 Create if successful
        res.status(201).send({
            status: 'Success',
            data: result,
        })
    } catch (err) {
        res.status(500).send({
            status: 'error',
            message: 'error while trying to add book to profile',
        })
    }


}

//get the authenticated users books
const getBooks = async (req, res) => {
    let user = null;

    try{
        //query db for user and eager load the books
        user = await User.fetchById(req.user.data.id, { withRelated: 'books'});
    } catch(error) {
        console.error(error);
        res.sendStatus(404);
        return;
    }
    try{
        //get all books for a profile
        const books = user.related('books')
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
    let user = null;

    try{
        //query db for user
        user = await User.fetchById(req.user.data.id);
    } catch(error) {
        console.error(error);
        res.sendStatus(404);
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
        if(validData.password) {
            //call password from user
            validData.password = await User.updatePassword(validData.password)
        }
        const updateProfiledUser = await user.save(validData);
        console.log("UpdateProfile user successufly:", updateProfiledUser);
        res.sendStatus(204) // Successfuly proccessed the request, there is no content to send for this request

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
    addBook,
    getBooks,
    updateProfile,
}