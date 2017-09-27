const loginRoutes = require('express').Router();
const pool  = require('../../db');
// const mysql = require('mysql2/promise');
const bcrypt  = require('bcrypt');

loginRoutes.route('/')
 .post(async (req, res) => {
     const{email, password} = req.body;

     if(!email || !password){
         return res.status(422).json({
             status: 'failed',
             err: 'data is not provided'
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

        const [findResult] = pool.query(`SELECT password FROM userDetails WHERE email = '${email}'`);
        console.log(findResult);
        
     }
     catch(err){
         console.log(err);
     }
 });

 module.exports = loginRoutes;