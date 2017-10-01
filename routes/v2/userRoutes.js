const userRoute = require('express').Router();
const pool  = require('../../db');
const {sendResponse} = require('../../helpers');
const bcrypt = require('bcrypt');


userRoute.route('/')
    .get(async (req, res) => {
        const [result]= await pool.query(`SELECT * FROM users WHERE isActive = ${1}`);
        // console.log(result);
        
        // removing password field of every user 
        result.map((item) => {
            console.log(item);
            delete item.password
        });

        return sendResponse(res, 200, result, 'successful');
    });


userRoute.route('/:id')
    .get(async (req, res) => {
        const id = req.params.id;

        try{
           const [data] =  await pool.query(`SELECT * FROM users WHERE id = '${id}'`);
        // console.log(data);
            return sendResponse(res, data, 'ok', 'successful', 200);
        }
        catch (err){
            console.log(err);
            return sendResponse(res, [], 'failed', 'invalid id', 400);
        }        
    })

    .patch(async (req, res) => {
        const {name, email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const id = req.params.id;

        try{
            const [newData] = await pool.query(`UPDATE users SET name = '${name}', password = '${hashedPassword}' WHERE id = '${id}'`);

            return sendResponse(res, newData, 'ok', 'updated successfully', 200);
        }
        catch(err){
            console.log(err);
            return sendResponse(res, [], 'failed', 'something went wrong', 500);
        }
    })

    .delete(async (req, res) => {

        const onlyDigitRegex = /^\d+$/;

        if(!onlyDigitRegex.test(req.params.id)){
            return sendResponse(res, 422, [], 'invalid parameter');
        }

        const idToBeDeleted = parseInt(req.params.id);        

        console.log(req.user);
        const idOfActionPerformer = req.user.userId;
        const typeOfActionPerformer = req.user.userType;
        

        try{

            if(idOfActionPerformer === idToBeDeleted ){ // the user is deleting his/her own account
                // console.log('user is deleting his/her own account');
                const [deletedRow] = await pool.query(`UPDATE users SET isActive = ${0} WHERE id = ${idToBeDeleted}`);
                
                return sendResponse(res, 200, [], 'user deleted');
            }
            else if (typeOfActionPerformer === 1){ // the user is an admin so he/she can delete an user
                // console.log('admin is deleting the user');
                const [deletedRow] = await pool.query(`UPDATE users SET isActive = ${0} WHERE id = ${idToBeDeleted}`);
                
                return sendResponse(res, 200, [], 'user deleted');
            }
            else {
                return sendResponse(res, 405, [], 'not allowed');            
            }
        }
        catch(err){
            console.log(err);
            return sendResponse(res, 500, [], 'Something went wrong');            
            
        }

        
    });



module.exports = userRoute;