const linkRoutes = require('express').Router();
const pool = require('../../db');
const _ = require( 'lodash');
const {sendResponse, isValidLink} = require('../../helpers');

linkRoutes.route('/')
    .get(async (req, res) => {
       try{
            const [data] = await pool.query(` select 

                l.link, l.description, l.createdAt as linkCreationTime, 
                u.name as linkOwner, ud.image as ownerImage,
                c.commentedBy as commentOwnerId, ud2.image as commentOwnerImage, c.comm as commentBody,
                u2.name as commentOwner, 
                c.createdAt as commTime

                from 

                links l left join comments c on  l.id = c.commentedOn
                inner join users u on l.createdBy = u.id
                inner join user_details ud on l.createdBy = ud.userId
                left join users u2 on c.commentedBy = u2.id
                left join user_details ud2 on c.commentedBy = ud2.userId
                `);
           // console.log(data);
           const newData = _.uniqBy(data,'link');
           for(let i = 0; i< newData.length; i++){

               for(let j=0; j<data.length; j++){
                   if(newData[i] === data[j] ){
                        //comment object
                   }
               }
           }
           console.log(newData);

           return sendResponse(res, 200, data, 'successful');
        }
       catch(err){
           console.log(err);
           return sendResponse(res, 503, [], 'service unavailable');
        }
    })
    .post(async (req, res) => {
        const {link, description} = req.body;
        //validation
        req.checkBody('link', 'Please mention the link').isEmpty();

        req.checkBody('description', 'Please decribe your link').isEmpty();

        let errors = req.validationErrors();

        if(errors){
            return sendResponse(res, 422, [], errors[0].msg);
        }
        // if(!link || !description){

        //     return sendResponse(res, 400, [], 'fields not provided');
        // }

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

        if(isNaN(id)){
            return sendResponse(res, 422, [], 'invalid arguments');
        }       

        try{
            const query = `
                select 

                l.link, l.description, l.createdAt as linkCreationTime, 
                u.name as linkOwner, ud.image as ownerImage,
                c.commentedBy as commentOwnerId, ud2.image as commentOwnerImage, c.comm as commentBody,
                u2.name as commentOwner, 
                c.createdAt as commTime

                from 

                links l left join comments c on  l.id = c.commentedOn
                inner join users u on l.createdBy = u.id
                inner join user_details ud on l.createdBy = ud.userId
                left join users u2 on c.commentedBy = u2.id
                left join user_details ud2 on c.commentedBy = ud2.userId



                where l.id = ${id}
            `;
            
            const [linkDetail] = await pool.query(query);

            if(linkDetail.length === 0 ){
                return sendResponse(res, 404, [], 'Data not found');
            }

            /**
             * refine the data from DB or proper response 
             */
            const commentArr = [];

            linkDetail.map((item) => {
                const commentObj = {};
                if(item.commentOwnerId){
                    commentObj.userId = item.commentOwnerId;
                    commentObj.userName = item.commentOwner;                
                    commentObj.userImage = item.commentOwnerImage;
                    commentObj.comment = item.commentBody;
                    commentObj.time = item.commTime;               

                    // push the commentobjectinto coment array
                    commentArr.push(commentObj);
                }
            });

            const responseData = {
                linkId: id,
                link: linkDetail[0].link,
                description: linkDetail[0].description,
                creationTime: linkDetail[0].linkCreationTime,
                userName:linkDetail[0].linkOwner,
                userImage: linkDetail[0].ownerImage,
                comments: commentArr
            }

            return sendResponse(res, 200, responseData, 'data fetched successfully');
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

            updateValues.push(`link = '${link}'`);
        }

        if(description){
            if(description.length < 4){
                return sendResponse(res, 422, [], 'Invalid link');                
            }

            updateValues.push(`description = '${description}'`);            
        }

        let updateQuery = 'UPDATE links SET ';

        if(updateValues.length > 0){
            updateQuery += updateValues.join();
        }

        updateQuery += ` WHERE id = ${linkId}`;
        console.log(updateQuery);
        

        try{
            //get user who created link
            const [row] = await pool.query(`SELECT createdBy FROM links WHERE id = ${linkId}`);
        
            if(row.length === 0){
                return sendResponse(res, 404, [], 'not found');
            }

            //check type of user if its admin then update 
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

            [row] = await pool.query(`SELECT createdBy FROM links WHERE id = '${idToBeDeleted}`);
            
            //validate data from db
            if(row.length === 0){
                
                return sendResponse(res, 404, [], 'not found');
            }

            //check typeOfAction performer is admin
            if(typeOfActionPerformer == 1){
                const [deletedData] = await pool.query(`DELETE FROM links WHERE id = '${idToBeDeleted}'`);
                console.log(deletedData);

            }

            //check idOfActionPerformer is the owner of link if yes than it can be delete
           if(idOfActionPerformer === row.createdBy){
            const [deletedData] = await pool.query(`DELETE FROM links WHERE id = '${idToBeDeleted}'`);
                console.log(deletedData);
            
           }
        }
        catch(err){
            console.log(err);
            return sendResponse(res, 403, [], 'forbidden');
        }
    })

module.exports = linkRoutes;