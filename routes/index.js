const express = require('express');
const router = express.Router();
const auth = require('../controllers/middlewares/auth')
/* GET / */
router.get('/', (req, res) => {
	res.send({ status: 'you had me at EHLO' });
});

router.use(auth.basic)

router.use('/books', require('./books'));

router.use('/authors', require('./authors'));

router.use('/users', require('./users'));

module.exports = router;