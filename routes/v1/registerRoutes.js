const registerRoutes = require('express').Router();
const { sendResponse } = require('../../helpers');
const pool = require('../../db');
const bcrypt = require('bcrypt');

registerRoutes.route('/').get((req, res) => res.send('Home Page'))
  .post(async (req, res) => {
    const { name, email, password } = req.body;

    // validation
    req.checkBody('name', 'name chars should be more than 5 chars').exists().isLength({ min: 5 });

    req.checkBody('email', 'invalid email').exists().isEmail();

    req.checkBody('password', 'invalid credentials').exists().isLength({ min: 5 });

    const errors = req.validationErrors();

    if (errors) {
      return sendResponse(res, 422, [], errors[0].msg);
    }

    // if(!name || name.length < 5){
    //   return sendResponse(res, 422, [], 'name is too short');
    // }

    // validate email
    // if(!email){
    //   return sendResponse(res, 400, [], 'email is not mentioned');
    // }

    // validate password
    // if(!password || password.length < 5){
    //   return sendResponse(res, 422, [], 'password too small or password can not be null');
    // }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        name,
        email,
        password: hashedPassword,
      };
      await pool.query('INSERT INTO users SET ?', userData);

      return sendResponse(res, 200, [], 'Registration successful, please go to /login ');
    }
    catch (err) {
      console.error(err);
      if (err.code === 'ER_DUP_ENTRY') {
        return sendResponse(res, 409, [], 'email already exist');
      }

      return sendResponse(res, 500, [], 'failed', 'something went wrong');
    }
  });

module.exports = registerRoutes;
