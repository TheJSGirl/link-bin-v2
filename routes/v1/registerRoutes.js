const registerRoutes = require('express').Router();
const pool = require('../../db');
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
      const data = await pool.query('INSERT INTO users SET ?', userData);
      console.log(data);

      return res.status(200).json({
        status: 'successful',
        message: 'data saved successfully'
      });

    }     
    catch(err){
      console.log(err);
      if(err.code === "ER_DUP_ENTRY"){
        return res.status(409).json({
          status: 'failed',
          err: 'Email already exist'
        })
      }
      return res.status(500).json({
        status: 'failed',
        err: 'something went wrong'
      });
    }
  });

  module.exports = registerRoutes;