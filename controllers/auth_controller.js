/**
 * Login controller
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const { validationResult, matchedData } = require('express-validator');

/**
 * Issue a access-token and a refresh-token from username & password for a user
 * POST /login
 */
const login = async (req, res) => {

    const user = await User.login(req.body.username, req.body.password)
    
    if (!user) {
        res.status(401).send({
            status: 'fail',
            data: 'Authentication required'
        });
        return;
    }

    //construct JWT payload
    const payload = {
        data: {
            id: user.get('id'),
            username: user.get('username'),
            is_admin: user.get('is_admin'),
        }
    }

    // sign payload and get access-token
    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h'})

    // sign payload and get refresh-token
    const refresh_token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_LIFETIME || '1w'})

    res.send({
        status: 'success',
        data: {
            access_token,
            refresh_token,
        },
    })
}

/**
 * Issue a new acces token from refresh token
 * POST /refresh
 */
const refresh = (req, res) => {
    const token = getTokenFromHeaders(req);

    if (!token) {
        res.status(401).send({
            status: 'fail',
            data: 'No token found in request headers'
        });
        return;
    }

    try{
        // verify token using the refresh token secret
        const { data } = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const payload = {
            data,
        }
        // issue a new token using access token secret
        const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_LIFETIME || '1h'});

        // send the access token to the client
        res.send({
            status: 'success',
            data: {
                access_token
            }
        })
    } catch(err) {
        res.status(403).send({
            status: 'fail',
            data: 'Invalid token'
        })
        console.error(err);
        return;
    }
}

/**
 * Register Account
 */

const register = async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        res.status(422).send({
            status: 'fail',
            data: errors.array()
        })
        return;
    }

    const validData = matchedData(req);

    // generate a hash of validData.password
    try{
        validData.password = await bcrypt.hash(validData.password, User.hashSaltRounds);
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exeption thrown when hashing the password when creating the user'
        })
        throw error;
    }

    // set hash of validData.password to validData.password

    try {
        // const User.create(validData).save();
        const storedUser = await new User(validData).save();
        console.log('new user: ', storedUser);

        const user = {
            username: storedUser.get('username'),
            first_name: storedUser.get('first_name'),
            last_name: storedUser.get('last_name'),
            id: storedUser.get('id'),
        }
        res.send({
            status: 'success',
            data: user
        })
    }  catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when trying to store a user in the database'
        })
        throw error
    }
}

/**
 * get token from HTTP headers
 */

const getTokenFromHeaders = (req) => {
    //check that we have Authorization header
    if (!req.headers.authorization) {
        return false;
    }
    //split authorizaton header into its pieces
    const [authType, token] = req.headers.authorization.split(' ')
    //check that the Authorization type is Bearer
    if (authType.toLowerCase() !== 'bearer') {
        return fasle;
    }

    return token;
}

module.exports = {
    login,
    refresh,
    register,
    getTokenFromHeaders,
}