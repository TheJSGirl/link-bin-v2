const linkRoutes = require('express').Router();
const pool = require('../../db');
const {sendResponse} = require('../../helpers');


linkRoutes.route('/')
    .get(async (req, res) => {
       try{
           const [data] = await pool.query(`select u.name as  userName, link from users u inner join links on createdBy = u.id`);
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

linkRoutes.route('/:id')
    .get(async(req, res) => {
        const onlyDigitRegex = /^\d+$/;

        if(!onlyDigitRegex.test(req.params.id)){

            return sendResponse(res, 422, [], 'invalid parameters');
        }

        const id = parseInt(req.params.id);        

        try{
            
            const userLinks = await pool.query(`SELECT links.link, links.description, links.createdBy, users.name FROM links inner join users on links.id = users.id`);
            return sendResponse(res, 200, userLinks, 'data fetched successfully');
        }
        catch(err){
            console.log(err);
            return sendResponse(res, 500, [], 'bad request');
        }
    })

module.exports = linkRoutes;