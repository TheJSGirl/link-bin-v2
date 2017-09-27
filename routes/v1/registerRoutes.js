const registerRoutes = require('express').Router();
const pool = require('../../db');
const  mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

registerRoutes.route('/')
  .get((req, res) => {
    
    return res.send('Home Page');
  })
  .post( async (req, res) => {
    const{name, email, password} = req.body;

    if(!name || name.length < 5){
      return res.status(422).json({
        status: 'failed',
        err: 'name is too short'
      })
    }

    //validate email
    if(!email){
      return res.status(422).json({
        status: 'failed',
        err: 'email not mentioned'
      })
    }

    //validate password
    if(!password || password.length < 5){
      return res.status(422).json({
        status: 'failed',
        err: 'password too small or password can not be null'
      })
    }

    try{
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const userData = {
        name,
        email,
        password: hashedPassword
      }
      const data = await pool.query('INSERT INTO userDetails SET ?', userData);
      console.log(data);

      return res.status(200).json({
        status: 'successful',
        message: 'data saved successfully'
      });

    }     
    catch(err){
      return res.status(500).json({
        status: 'failed',
        err: 'something went wrong'
      });
    }
  });

  module.exports = registerRoutes;