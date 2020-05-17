/**
 * Author validation rules
 */
const { body } = require('express-validator');

const rules = {};
rules.createRules = [];

rules.updateRules = [];

rules.destroyRules = [];

module.exports = {
    ...rules,
}