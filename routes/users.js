const express = require('express');
const router = express.Router();
const { index, show, store, update, destroy } = require('../controllers/user_controller');

const { validateStore } = require('../validation/user_validation')
/* GET / */
router.get('/', index);

/* GET /:authorId */
router.get('/:userId', show);

/* POST / */
router.post('/', validateStore, store);

/* Update a specific resource */
router.put('/:userId', update);

/* Destroy a specific resource /:userId */
router.delete('/:userId', destroy);

module.exports = router;