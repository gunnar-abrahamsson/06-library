const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, getBooks } = require('../controllers/profile_controller');

const { updateProfileRules } = require('../validation/profile_validation');
/* GET resource / */
router.get('/', getProfile);

/* GET resources books */
router.get('/books', getBooks);

/* Update a specific resource */
router.put('/', updateProfileRules, updateProfile);

module.exports = router;