const linkRoutes = require('express').Router();
const pool = require('../../db');
const {sendResponse} = require('../../helpers');


linkRoutes.route('/')
    .get(async (req, res) => {
       try{
           const [data] = await pool.query(`SELECT * FROM links`);
           // console.log(data);
           return sendResponse(res, 200, data, 'successful');
        }
       catch(err){
           console.log(err);
           return sendResponse(res, 503, [], 'service unavailable');
        }
    })
    .post(async (req, res) => {
        const {link, description} = req.body;
        if(!link || !description){

            return sendResponse(res, 400, [], 'fields not provided');
        }

        const id = req.user.userId;

        try{
            const linkData = {
                link,
                description,
                createdBy: id
            }
            
            const [result] = await pool.query('INSERT INTO links SET ?',linkData);

            return sendResponse(res, 200, linkData, 'saved successfully');
            
        }
        catch(err){
            console.log(err);
            return sendResponse(res, 404, [], 'not found');

        }
    })

module.exports = linkRoutes;