const loginRoute = require('express').Router();
const { sendResponse } = require('../../helpers');
const jwt = require('jsonwebtoken');
const pool = require('../../db');
const bcrypt = require('bcrypt');

loginRoute.route('/')
  .post(async (req, res) => {
    // validating email password
    req.checkBody('email', 'invalid email').exists().isEmail();
    req.checkBody('password', 'invalid credentials').exists().isLength({ min: 5 });

    const errors = req.validationErrors();

    if (errors) {
      return sendResponse(res, 422, [], errors[0].msg);
    }

    const { email, password } = req.body;

    //  if(!email || !password){
    //     return sendResponse(res, 422, [],'invalid credentials');
    //  }

    //  if(password.length < 5){
    //     return sendResponse(res, 400, [], 'password is too short');
    //  }

    //  console.log(req.body);

    try {
      // const [dbEmail]  = await pool.query('SELECT * FROM userDetails WHERE email = ?', [email]);
      // console.log(dbEmail);

      const [findResult] = await pool.query(`SELECT password,isActive, isBanned, id, userType FROM users WHERE email = '${email}'`);
      console.log(findResult);

      if (!findResult.length) {
        return sendResponse(res, 404, [], 'user not found');
      }

      const isActive = parseInt(findResult[0].isActive, 10);

      if (!isActive) {
        return sendResponse(res, 403, [], 'Your account is suspended, contact admin');
      }

      const isBanned = parseInt(findResult[0].isBanned, 10);

      if (isBanned === 1) {
        return sendResponse(res, 403, [], 'Your account is banned, contact admin');
      }


      if (findResult.length === 0) {
        /**
             * if the email is not registered,
             * db will give empty result
             * then tell the user that email not registered/user not found
             */

        return sendResponse(res, 404, [], 'email is not registered');
      }

      /**
         * if database return a row (inside findResult), that means
         * user is registered, and the database has fetched his password
         * now compare the pass from DB with the pass in req.body
         */


      const passwordFromDB = findResult[0].password;
      const isValidpassword = await bcrypt.compare(password, passwordFromDB);

      if (!isValidpassword) {
        return sendResponse(res, 401, [], 'failed to authenticate');
      }

      // user email from database
      // const userId = findResult[0].id;
      const userData = {
        userId: findResult[0].id,
        userType: findResult[0].userType,
      };

      // generate the JWT token
      const token = jwt.sign(userData, 'abcdefghigkl', { expiresIn: 60 * 60 });
      // console.log(token);

      // set token in response header
      res.header('x-auth', token);
      return sendResponse(res, 200, { token }, 'Login successful');
      // res.header('x-auth', token);
      // return sendResponse(res, userData, 'ok', 'Welcome', 200);
    } catch (err) {
      console.log(err);
      return sendResponse(res, 500, [], 'something went wrong');
    }
  });

module.exports = loginRoute;
