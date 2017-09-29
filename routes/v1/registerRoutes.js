const registerRoutes = require('express').Router();
const {sendResponse} = require('../../helpers');
const pool = require('../../db');
const bcrypt = require('bcrypt');

registerRoutes.route('/')
  .get((req, res) => {
    
    return res.send('Home Page');
  })
  .post( async (req, res) => {
    const{name, email, password} = req.body;

    if(!name || name.length < 5){
      return sendResponse(res, [], 'failed', 'name is too short', 422);
    }

    //validate email
    if(!email){
      return sendResponse(res, [], 'failed', 'email is not mentioned');
    }

    //validate password
    if(!password || password.length < 5){
      return sendResponse(res, [], 'failed', 'password too small or password can not be null', 422);
    }

    try{
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        name,
        email,
        password: hashedPassword
      }
      const data = await pool.query('INSERT INTO users SET ?', userData);
      console.log(data);

      return sendResponse(res, data, 'successful', 'data saved successfully', 200);
    }     
    catch(err){
      console.log(err);
      if(err.code === "ER_DUP_ENTRY"){
        return sendResponse(res, [], 'failed', 'email already exist', 409);
      }

      return sendResponse(res, [], 'failed', 'something went wrong', 500);
    }
  });

  module.exports = registerRoutes;