const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getBooks, addBook } = require('../controllers/profile_controller');

const { updateProfileRules, addBookRules } = require('../validation/profile_validation');
/* GET resource / */
router.get('/', getProfile);

/* GET resources books */
router.get('/books', getBooks);

/* Add a book to this user's collection */
router.post('/books', addBookRules, addBook)

/* Update a specific resource */
router.put('/', updateProfileRules, updateProfile);

module.exports = router;