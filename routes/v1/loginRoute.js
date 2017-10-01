const loginRoute = require('express').Router();
const {sendResponse} = require('../../helpers');
const jwt = require('jsonwebtoken');
const pool  = require('../../db');
const bcrypt  = require('bcrypt');

loginRoute.route('/')
 .post(async (req, res) => {
     const{email, password} = req.body;

     if(!email || !password){
        return sendResponse(res, 422, [],'invalid credentials');
     }

     if(password.length < 5){
        return sendResponse(res, 400, [], 'password is too short');
     }

     console.log(req.body);

     try{
        
        // const [dbEmail]  = await pool.query('SELECT * FROM userDetails WHERE email = ?', [email]);
        // console.log(dbEmail);

        const [findResult] = await pool.query(`SELECT password, id, userType FROM users WHERE email = '${email}'`);
        console.log(findResult);

        if(findResult.length === 0){
            /**
             * if the email is not registered,  
             * db will give empty result
             * then tell the user that email not registered/user not found
             */

            return sendResponse(res,404, [], 'email is not registered');
        }

        /**
         * if database return a row (inside findResult), that means 
         * user is registered, and the database has fetched his password
         * now compare the pass from DB with the pass in req.body 
         */

        
        const passwordFromDB = findResult[0].password;
        const isValidpassword = await bcrypt.compare(password, passwordFromDB);

        if(!isValidpassword){
            return sendResponse(res,401,  [], 'failed to authenticate');
        }

        //user email from database
        // const userId = findResult[0].id;
        const userData = {
            userId: findResult[0].id,
            userType: findResult[0].userType
        }

        //generate the JWT token
        const token = jwt.sign(userData, 'abcdefghigkl', {expiresIn: 60 * 60});
        console.log(token);

        return res.header('x-auth', token).status(200).json({
            status: 'ok',
            message: 'welcome'
        });
        
        // res.header('x-auth', token);
        // return sendResponse(res, userData, 'ok', 'Welcome', 200);

        // return res.status(200).json({
        //     status:'successful',
        //     message:'login successfully'
        // });
    }
     catch(err){
         console.log(err);
         return sendResponse(res, 500, [], 'something went wrong');
     }
 });

 module.exports = loginRoute;