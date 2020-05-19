/**
 * Author validation rules
 */
const { body } = require('express-validator');

const rules = {};
rules.loginRules = [
    body('username').isString().trim().isLength({min: 3}),
    body('password').isString().trim().isLength({min: 4}),
];

module.exports = {
    ...rules,
}