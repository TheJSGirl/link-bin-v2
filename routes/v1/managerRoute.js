const managerRoute = require('express').Router();
const pool  = require('../../db');

managerRoute.route('/')
    .get(async (req, res) => {
        const userId = req.user.userId;
        try{
            const [userRow] = await pool.query(`SELECT name FROM users where id = ${userId}`);

            if(userRow.length === 0){
                return res.status(404).json({
                    status: 'faild',
                    err: 'user not found'
                });
            }
            const nameOfManager = userRow[0].name;

            return res.status(200).json({
                status: 'ok',
                message: `Welcom ${nameOfManager}, this is manager area`
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

module.exports = managerRoute;