const express = require('express');
const router = express.Router();
const { index, show, store, update, destroy } = require('../controllers/book_controller');
/* GET all resources  / */
router.get('/', index);

/* GET specific resource /:bookId */
router.get('/:bookId', show);

/* store a new resources */
router.post('/', store);

/* Update a specific resource */
router.put('/:bookId', update);

/* Destroy a specific resource /:bookId */
router.delete('/:bookId', destroy);

module.exports = router;