const managerRoute = require('express').Router();
const {sendResponse} = require('../../helpers');
const pool  = require('../../db');

managerRoute.route('/')
    .get(async (req, res) => {
        const userId = req.user.userId;
        try{
            const [userRow] = await pool.query(`SELECT name FROM users where id = ${userId}`);

            if(userRow.length === 0){
                return sendResponse(res, [], 'failed', 'user not found', 404);
            }
            const nameOfManager = userRow[0].name;

            // return res.status(200).json({
            //     status: 'ok',
            //     message: `Welcom ${nameOfManager}, this is manager area`
            // });
            return sendResponse(res, [], 'ok', `Welcom ${nameOfManager}, this is manager area`, 200);

        }
        catch (err){
            console.log(err);
            return sendResponse(res, [], 'failed', 'something went wrong', 500);
        }
    })

module.exports = managerRoute;