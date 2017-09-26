const registerRoutes = require('express').Router();
const pool = require('../../db');

registerRoutes.route('/')
  .get((req, res) => {
    
    return res.send('GET Route');
  })
  .post((req, res) => {
    const{name, email, pass, confirmPass} = req.body;

    const userData = {
      name,
      email,
      password,
      confirmPass
    }
     return console.log(userData);
  })

  module.exports = registerRoutes;