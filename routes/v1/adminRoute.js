const adminRoute = require('express').Router();
const pool  = require('../../db');

adminRoute.route('/')
    .get(async (req, res) => {
        

        const userId = req.user.userId;

        try {
            const [userRow] = await pool.query(`SELECT name FROM users where id = ${userId}`);

            console.log(userRow);

            if(userRow.length === 0){

                return res.status(404).json({
                    status: 'failed',
                    err: 'user not found'
                });
            }

            const nameOfUser = userRow[0].name;

            return res.status(200).json({
                status: 'ok',
                message: `Welcome ${nameOfUser}, this is admin area`
            });
        }   
        catch (err){
            console.log(err);
            return res.status(500).json({
                status: 'failed',
                err: 'something went wrong'
            });
        }
    })

module.exports = adminRoute;

