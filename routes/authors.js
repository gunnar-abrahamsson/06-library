const express = require('express');
const router = express.Router();
const { index, show, store, update, destroy } = require('../controllers/author_controller');

const { createRules, updateRules, destroyRules } = require('../validation/author_validation');
/* GET / */
router.get('/', index);

/* GET /:authorId */
router.get('/:authorId', show);

/* store a new resources */
router.post('/', createRules, store);

/* Update a specific resource */
router.put('/:authorId', updateRules, update);

/* Destroy a specific resource /:authorId */
router.delete('/:authorId', destroyRules, destroy);

module.exports = router;