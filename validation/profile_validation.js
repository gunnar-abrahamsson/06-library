/**
 * User validation rules
 */
const { body } = require('express-validator');
const models = require('../models');

const rules = {};

rules.updateProfileRules = [
    body('password').optional().isString().trim().isLength({min: 4}),
    body('first_name').optional().isString().trim().isLength({min: 2}),
    body('last_name').optional().isString().trim().isLength({min: 2}),
];

module.exports = {
    ...rules,
}