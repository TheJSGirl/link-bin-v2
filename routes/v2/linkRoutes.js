const linkRoutes = require('express').Router();
const pool = require('../../db');
const {sendResponse, isValidLink} = require('../../helpers');

linkRoutes.route('/')
    .get(async (req, res) => {
       try{
            const [data] = await pool.query(`SELECT 
            u.name as  userName, ud.image, l.link , l.description, l.createdAt 
            FROM
            users u inner join links l ON l.createdBy = u.id 
            inner join user_details ud ON u.id = ud.userId`);
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
    
    .patch(async (req, res) => {
        const actionPerformerId = req.user.userId;
        const typeOfActionPerformer = req.user.userType;
        const linkId = parseInt(req.params.id);
        
        if(isNaN(linkId)){
            return sendResponse(res, 422, [], 'invalid id');
        }

        const {link, description} = req.body;

        if(!link && !description){
            return sendResponse(res, 422, [], 'missing parameters');            
        }

        const updateValues = [];        

        if(link){
            if(!isValidLink(link)){
                return sendResponse(res, 422, [], 'Invalid link');
            }

            updateValues.push(`link = '${link}`);
        }

        if(description){
            if(description.length < 4){
                return sendResponse(res, 422, [], 'Invalid link');                
            }

            updateValues.push(`description = '${description}`);            
        }

        let updateQuery = 'UPDATE links SET ';

        if(updateValues.length > 0){
            updateQuery += updateValues.join();
        }

        updateQuery += ` WHERE id = ${linkId}`;
        

        try{
            //get user who created link
            const [row] = await pool.query(`SELECT createdBy from links where id = ${linkId}`);
        
            if(row.length === 0){
                return sendResponse(res, 404, [], 'not found');
            }

            //check type of user if its not admin then early return
            if(typeOfActionPerformer === 1){
                //run update query because use is admin
                const [updated] = await pool.query(updateQuery);

                return sendResponse(res, 200, [], 'data updated');
            }

            else if(actionPerformerId === row[0].createdBy){
                //run update query
                const [updated] = await pool.query(updateQuery);

                return sendResponse(res, 200, [], 'data updated');                
                
            }

            return sendResponse(res, 405, [], 'not allowed');

        }
        catch(err){
            console.log(err);
            return sendResponse(res, 500, [], 'bad request');
        }
    })

    .delete((req, res) => {
        const onlyDigitRegex = /^\d+$/;

        if(!onlyDigitRegex.test(req.params.id)){
            return sendResponse(res, 422, [], 'invalid parameter');
        }

        const idToBeDeleted = parseInt(req.params.id);        

        console.log(req.user);
        const idOfActionPerformer = req.user.userId;
        const typeOfActionPerformer = req.user.userType;

        try{
            if(idOfActionPerformer === idToBeDeleted){
            }
        }
        catch(err){
            console.log(err);
            return sendResponse(res, 403, [], 'forbidden');
        }
    })

module.exports = linkRoutes;