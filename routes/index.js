const express = require('express');
const router = express.Router();
const { loginRules } = require('../validation/login_validation')
const auth = require('../controllers/middlewares/auth');
const authController = require('../controllers/auth_controller')
const userValidation = require('../validation/user_validation');
/* GET / */
router.get('/', (req, res) => {
	res.send({ status: 'you had me at EHLO' });
});

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));
// add ability to login and get a JWT
router.post('/login', [loginRules], authController.login);

// add ability to refresh a token
router.post('/refresh', authController.refresh);

// add ability to register
router.post('/register', [userValidation.createRules], authController.register);

// add ability to validate JTW's
router.use('/profile', [auth.validateJwtToken], require('./profile'))

module.exports = router;