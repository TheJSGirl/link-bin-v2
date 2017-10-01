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
      return sendResponse(res, 422, [], 'name is too short');
    }

    //validate email
    if(!email){
      return sendResponse(res, 400, [], 'email is not mentioned');
    }

    //validate password
    if(!password || password.length < 5){
      return sendResponse(res, 422, [], 'password too small or password can not be null');
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

      return sendResponse(res,200, data, 'data saved successfully');
    }     
    catch(err){
      console.log(err);
      if(err.code === "ER_DUP_ENTRY"){
        return sendResponse(res, 409, [], 'email already exist');
      }

      return sendResponse(res, 500, [], 'failed', 'something went wrong');
    }
  });

  module.exports = registerRoutes;