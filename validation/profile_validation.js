/**
 * User validation rules
 */
const { body } = require('express-validator');
const { Book } = require('../models');

const rules = {};

rules.updateProfileRules = [
    body('password').optional().isString().trim().isLength({min: 4}),
    body('first_name').optional().isString().trim().isLength({min: 2}),
    body('last_name').optional().isString().trim().isLength({min: 2}),
];

rules.addBookRules = [
    body('book_id').isNumeric().custom(value => Book.fetchById(value)),
    // body('book_id').isNumeric().custom(async value => {
    //     const book = await new models.Book({ id: value}).fetch();

    //     if(!book){
    //         return Promise.reject(`Book: ${value} doesn't exist`)
    //     }

    //     return Promise.resolve();

    // }),
];

module.exports = {
    ...rules,
}