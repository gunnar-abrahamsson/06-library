const express = require('express');
const router = express.Router();
const { index, show, store, update, destroy } = require('../controllers/book_controller');

const { createRules, updateRules, destroyRules } = require('../validation/book_validation');

/* GET all resources  / */
router.get('/', index);

/* GET specific resource /:bookId */
router.get('/:bookId', show);

/* store a new resources */
router.post('/', createRules, store);

/* Update a specific resource */
router.put('/:bookId', updateRules, update);

/* Destroy a specific resource /:bookId */
router.delete('/:bookId', destroyRules, destroy);

module.exports = router;