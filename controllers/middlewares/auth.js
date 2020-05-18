/**
 * Authentication middleware
 */

const { User } = require('../../models')

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

module.exports = {
    basic
}