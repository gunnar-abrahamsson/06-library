/**
 * Login controller
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models')

module.exports = async (req, res) => {

    //
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.login(username, password)
    
    if (!user) {
        res.status(401).send({
            status: 'fail',
            data: 'Authentication required'
        });
        return;
    }

    //construct JWT payload
    const payload = {
        sub: user.get('id'),
        username: user.get('username'),
        is_admin: user.get('is_admin'),
    }

    // sign payload and get jwt-token
    const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)

    res.send({
        status: 'success',
        data: {
            token,
        },
    })
}