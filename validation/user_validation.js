const { body } = require('express-validator');

const validateStore = [
    body('username').isString().trim().isLength({min: 3}),
    body('password').isString().trim().isLength({min: 4}),
    body('first_name').isString().trim().isLength({min: 2}),
    body('last_name').isString().trim().isLength({min: 2}),
]

module.exports = {
    validateStore,
}