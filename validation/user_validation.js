/**
 * User validation rules
 */
const { body } = require('express-validator');
const models = require('../models');

const rules = {};
rules.createRules = [
    body('username').isString().trim().isLength({min: 3}).custom(async value => {
        const user = await new models.User({ username: value}).fetch({ require: false });
        console.log("username query result: ", user);

        if(user){
            return Promise.reject(`Username: ${value} already exist`)
        }

        return Promise.resolve();

    }),
    body('password').isString().trim().isLength({min: 4}),
    body('first_name').isString().trim().isLength({min: 2}),
    body('last_name').isString().trim().isLength({min: 2}),
];

rules.updateRules = [
    body('password').optional().isString().trim().isLength({min: 4}),
    body('first_name').optional().isString().trim().isLength({min: 2}),
    body('last_name').optional().isString().trim().isLength({min: 2}),
];

rules.destroyRules = [];

module.exports = {
    ...rules,
}