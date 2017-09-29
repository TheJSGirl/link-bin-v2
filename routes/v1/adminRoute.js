const adminRoute = require('express').Router();
const {sendResponse} = require('../../helpers');
const pool  = require('../../db');

adminRoute.route('/')
    .get(async (req, res) => {
        

        const userId = req.user.userId;

        try {
            const [userRow] = await pool.query(`SELECT name FROM users where id = ${userId}`);

            console.log(userRow);

            if(userRow.length === 0){
                return sendResponse(res, [], 'failed', 'user not found', 404); 
            }

            const nameOfUser = userRow[0].name;

            // return res.status(200).json({
            //     status: 'ok',
            //     message: `Welcome ${nameOfUser}, this is admin area`
            // });
            return sendResponse(res, [], 'ok', `Welcome ${nameOfUser}, this is admin area`, 200);
        }   
        catch (err){
            console.log(err);
            return sendResponse(res, [], 'failed', 'something went wrong', 500);
        }
    })

module.exports = adminRoute;
