const express = require('express');
const router = express.Router();
const { index, show, store, update, destroy } = require('../controllers/user_controller');

const { createRules, updateRules, destroyRules } = require('../validation/user_validation');
/* GET / */
router.get('/', index);

/* GET /:authorId */
router.get('/:userId', show);

/* POST / */
router.post('/', createRules, store);

/* Update a specific resource */
router.put('/:userId', updateRules, update);

/* Destroy a specific resource /:userId */
router.delete('/:userId', destroyRules, destroy);

module.exports = router;