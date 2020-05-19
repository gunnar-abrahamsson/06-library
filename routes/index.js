const express = require('express');
const router = express.Router();
const { loginRules } = require('../validation/login_validation')
/* GET / */
router.get('/', (req, res) => {
	res.send({ status: 'you had me at EHLO' });
});

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));
// add ability to login and get a JWT
router.post('/login', [loginRules], require('../controllers/login_controller'));

// add ability to validate JTW's
router.use('/profile', require('./profile'))
router.use('/users', require('./users'));

module.exports = router;