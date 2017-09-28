const loginRoutes = require('express').Router();
const jwt = require('jsonwebtoken');
const pool  = require('../../db');
const bcrypt  = require('bcrypt');

loginRoutes.route('/')
 .post(async (req, res) => {
     const{email, password} = req.body;

     if(!email || !password){
         return res.status(422).json({
             status: 'failed',
             err: 'Invalid credentials'
         });
     }

     if(password.length < 5){
         return res.status(422).json({
             status: 'failed',
             err: 'password is too short'
         });
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

            return res.status(404).json({
                status: 'failed',
                err: 'email is not registered'
            });
        }

        /**
         * if database return a row (inside findResult), that means 
         * user is registered, and the database has fetched his password
         * now compare the pass from DB with the pass in req.body 
         */

        
        const passwordFromDB = findResult[0].password;
        const isValidpassword = await bcrypt.compare(password, passwordFromDB);

        if(!isValidpassword){
            return res.status(401).json({
                status: 'failed',
                err: ' failed to authenticate'
            });
        }

        //user email from database, likha email h diya id h ? 
        // error me hai ki expiresIn jabhi use kar sakte hai jab payload ek object hoga...tmhara payload ek number h isiliye expiry set nhi hogi 

        // ab ho jayega
        // const userId = findResult[0].id;
        const userData = {
            userId: findResult[0].id,
            userType: findResult[0].userType
        }

        //generate the JWT token
        const token = jwt.sign(userData, 'abcdefghigkl', {expiresIn: 60});
        console.log(token);

        return res.header('x-auth', token).status(200).json({
            status: 'ok',
            message: 'welcome'
        });

        // return res.status(200).json({
        //     status:'successful',
        //     err:'login successfully'
        // });

        
        
     }
     catch(err){
         console.log(err);
     }
 });

 module.exports = loginRoutes;