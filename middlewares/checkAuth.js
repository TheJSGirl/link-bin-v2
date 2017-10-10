const jwt = require('jsonwebtoken');

/**
 * @author Priyanka Negi github.com/theJSGirl
 * @function checkAuth a middleware to check authentication
 * 
 * This middleware checks for the token in the req headers 
 * if the token is missing/invalid, it respons with 401
 * else if there is token, it simply decodes the data in the token 
 * and transfer the call to the next middleware add 
 * adds an user object to the req object 
 * the req.user will contain the decoded data
 * 
 * @param {object} req the request object from client 
 * @param {object} res the response object to be sent 
 * @param {function} next this transfer the call to the next middleware
 * 
 * @return {null}   
 */

const checkAuth = async (req, res, next) => {
    // check if req.header has x-token or not
    // if no token then respond with 401

    // const token =req.body.token || req.query.token || req.headers['x-access-token'];

    const token = req.header('x-auth');
    // console.log(req.header);
    // console.log('token => ', token);
    
    if(!token || typeof token === 'undefined'){
        return res.status(401).json({
            status: 'failed',
            err: 'invalid token'
        });
    }

    // if token is there,
        // verify the token is valid
        // check if token expired or not 
        // send 401
        
    

    // finally decode the token 
    // attach it to req.user (which will contain user details)
    // just call next() 
    try{
        const decode = await jwt.verify(token, 'abcdefghigkl');
        console.log(decode);
        req.user = decode;
        next();
    }
    catch(err){
        // always log error( in case of 500
        console.log(err); 
        if(err.name === 'TokenExpiredError'){
            return res.status(401).json({
                status: 'failed',
                err: 'Token is expired'
            });
        }
        return res.status(500).json({
            status: 'failed',
            err: 'something went wrong '
        });
    }
}


module.exports = checkAuth;