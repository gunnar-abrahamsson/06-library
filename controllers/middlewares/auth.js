/**
 * Authentication middleware
 */

const { User } = require('../../models');
const jwt = require('jsonwebtoken');

const basic = async (req, res, next) => {

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
    if(authSchema.toLowerCase() !== 'basic') {
        // not ours to authenticate
        next();
    }
    
    //decode payload
    
    const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii')
    
    const [username, password] = decodedPayload.split(':');
    try {
        const user = await User.login(username, password);
        //bail if user is false
    
        if(!user){
            res.status(401).send({
                status: 'fail',
                data: 'Authorization failed'
            })
            return;
        }
    
        //attach user to req;
        
        req.user = user;
        //delete req.user.attributes.password
        next();
    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Error when trying to authenticate'
        })
        throw error;
    }
}

const validateJwtToken = (req, res, next) => {
    //check that we have Authorization header
    if (!req.headers.authorization) {
        res.status(401).send({
            status: 'fail',
            data: 'Authentication is required'
        });
        return;
    }
    //split authorizaton header into its pieces
    const [authType, token] = req.headers.authorization.split(' ')
    //check that the Authorization type is Bearer
    if (authType.toLowerCase() !== 'bearer') {
        res.status(401).send({
            status: 'fail',
            data: 'Authentication is required'
        });
        return;
    }

    // Validate token and extract payload
    let payload = null;
    try{
        payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        

    } catch (error) {
        res.status(401).send({
            status: 'fail',
            data: 'Authentication failed'
        });
        throw error
    }

    //attach payload to req.user
    req.user = payload;

    next();
}

module.exports = {
    basic,
    validateJwtToken,
}