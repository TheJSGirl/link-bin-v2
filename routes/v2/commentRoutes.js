const commentRoutes = require('express').Router();
const pool = require('../../db');
const { sendResponse } = require('../../helpers');
const expressValidator = require('express-validator');


commentRoutes.route('/:linkId/comments').get(async(req, res) => {
    const linkId = req.params.linkId;
    try{
        const data = await pool.query(`SELECT comm, commentedBy, createdAt FROM comments WHERE commentedOn = '${linkId}'`);
        return sendResponse(res, 200, data, 'All comments');
    }
    catch(err){
        console.log(err);
        return sendResponse(res, 500, [], 'bad request');
    }
    })
    .post(async(req, res) => {
        const{comm} = req.body;
        //these values comming from token
        const userId = req.user.userId;        
        const linkId = req.params.linkId; 
        //validation
        req.checkBody('comm', 'Please mention comment').exists();
        console.log(linkId);
        try{
            const comment = {
                comm,
                commentedBy: userId,
                commentedOn: linkId
            }
            const [result] = await pool.query('INSERT INTO comments SET ?',comment);
            return sendResponse(res, 200, result, 'sent successfully');
        }
        catch(err){
            console.log(err);
            return sendResponse(res, 404, [], 'not found');
        }        
    });

module.exports = commentRoutes;