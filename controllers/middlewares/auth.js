/**
 * Authentication middleware
 */

const { User } = require('../../models')

const basic = async (req, res, next) => {
    console.log('hello from auth.basic')

    // check if Authorization header exists, otherwise bail
    if(!req.headers.authorization){
        res.status(401).send({
            status: 'fail',
            data: 'Authorization required'
        })
        return;
    }

    // "Basic as32132dasj231hk32kh23h3kjKJK2"
    // =>
    // [0] = "Basic"
    // [1] = "as32132dasj231hk32kh23h3kjKJK2"

    const [authSchema, base64Payload] = req.headers.authorization.split(' ');

    if(!authSchema.toLowerCase() === ' basic') {
        // not ours to authenticate
        next();
    }

    //decode payload

    const decodedPayload = new Buffer(base64Payload, 'base64').toString('ascii')

    const [username, password] = decodedPayload.split(':');

    const user = await new User({ username, password}).fetch({require: false});

    if(!user){
        res.status(401).send({
            status: 'fail',
            data: 'Authorization failed'
        })
        return;
    }

    //attach user to req;
    req.user = user;

    next();
}

module.exports = {
    basic
}