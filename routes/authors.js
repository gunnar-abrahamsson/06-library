const express = require('express');
const router = express.Router();
const { index, show, store, update, destroy } = require('../controllers/author_controller');
/* GET / */
router.get('/', index);

/* GET /:authorId */
router.get('/:authorId', show);

/* store a new resources */
router.post('/', store);

/* Update a specific resource */
router.put('/:authorId', update);

/* Destroy a specific resource /:authorId */
router.delete('/:authorId', destroy);

module.exports = router;