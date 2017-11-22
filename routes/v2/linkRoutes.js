const linkRoutes = require('express').Router();
const pool = require('../../db');
const _ = require('lodash');
const { sendResponse, isValidLink } = require('../../helpers');
const { check, validationResult } = require('express-validator/check');

linkRoutes.route('/').get(async (req, res) => {
  try {
    const query = 'SELECT l.id, l.link, l.description, l.createdAt, l.createdBy, ud.image, u.name FROM links l INNER JOIN user_details ud ON ud.userId = l.createdBy INNER JOIN users u ON u.id = l.createdBy';
    const [linkDetail] = await pool.query(query);
    // fetch comments
    const commentQuery = `SELECT c.comm, c.commentedBy, c.createdAt, u.name, c.commentedOn, ud.image FROM comments c INNER JOIN  users u ON c.commentedBy = u.id
        INNER JOIN user_details ud ON ud.userId = c.commentedBy`;
    const [commentDetail] = await pool.query(commentQuery);
    // console.log(commentDetail);

    // check isOwner or canDelete feature
    const { userId } = req.user; // get the id sent by token
    let canDelete = 0;
    let isOwner = 0;

    // check userId and link createdBy is equal if yes than toggle the values of isOwner and canDelete
    if (userId === linkDetail[0].createdBy) {
      isOwner = 1;
      canDelete = 1;
    }
    // add isOwner property with linkDetail
    linkDetail[0].isOwner = isOwner;
    linkDetail[0].canDelete = canDelete;

    // fetching linkId from linkDetails for collecting comments on a link
    const linkId = [];
    linkDetail.forEach((item) => {
      // console.log(item);
      linkId.push(item.id);
    });
    // here refining no. of comments on a particular link or fetching all comments of particular link
    for (let i = 0; i < linkId.length; i++) {
      const commentOnLink = []; // made empty array to collect the list of comments on particular link
      for (let j = 0; j < commentDetail.length; j++) {
        const commentList = {}; // made empty object to add the comment detail of
        if (userId === commentDetail[j].commentedBy) {
          isOwner = 1;
          canDelete = 1;
          commentList.isOwner = isOwner;
          commentList.canDelete = canDelete;
        }

        if (linkId[i] === commentDetail[j].commentedOn) {
          commentList.commemt = commentDetail[j].comm;
          commentList.commentedBy = commentDetail[j].commentedBy;
          commentList.name = commentDetail[j].name;
          commentList.image = commentDetail[j].image;
          commentList.time = commentDetail[j].createdAt;

          // commentOnLink.push(commentDetail[j].comm);
          commentOnLink.push(commentList);
        }
      }
      linkDetail[i].comments = commentOnLink;
    }
    console.log(linkDetail);
    return sendResponse(res, 200, linkDetail, 'successful');
  } catch (err) {
    console.log(err);
    return sendResponse(res, 503, [], 'service unavailable');
  }
})
  .post(async (req, res) => {
    const { link, description } = req.body;
    // validation
    req.checkBody('link', 'Please mention the link').exists();
    req.checkBody('description', 'Please describe your link').exists();
    const errors = req.validationErrors();
    if (errors) {
      return sendResponse(res, 422, [], errors[0].msg);
    }
    // if(!link || !description){
    // return sendResponse(res, 400, [], 'fields not provided');
    // }
    const id = req.user.userId;
    try {
      const linkData = {
        link,
        description,
        createdBy: id,
      };
      await pool.query('INSERT INTO links SET ?', linkData);
      return sendResponse(res, 200, [], 'saved successfully');
    } catch (err) {
      console.log(err);
      return sendResponse(res, 404, [], 'not found');
    }
  });

linkRoutes.route('/:linkId').get(async (req, res) => {
  const { linkId } = req.params;
  // validations
  // checkBody('linkId', 'linkId is missing').exists();
  try {
    const query = `SELECT l.link, l.description, l.createdAt, l.createdBy, ud.image, u.name FROM links l INNER JOIN user_details ud ON ud.userId = l.createdBy INNER JOIN users u ON u.id = l.createdBy WHERE l.id = ${linkId}`;
    const [linkDetail] = await pool.query(query);
    if (linkDetail.length === 0) {
      return sendResponse(res, 404, [], 'Data not found');
    }
    console.log(linkDetail);

    const { userId } = req.user;

    let isOwner = 0;
    let canDelete = 0;

    if (userId === linkDetail[0].createdBy) {
      isOwner = 1;
      canDelete = 1;
    }

    delete linkDetail[0].createdBy;

    linkDetail[0].isOwner = isOwner;

    const commentQuery = `SELECT c.comm, c.commentedBy, c.createdAt, u.name, ud.image FROM comments c 
            INNER JOIN  users u ON c.commentedBy = u.id INNER JOIN user_details ud ON ud.userId = c.commentedBy
            where c.commentedOn = ${linkId}`;

    const [commentDetail] = await pool.query(commentQuery);

    commentDetail.forEach((comment) => {
      let commentOwner = 0;
      if (comment.commentedBy === userId) {
        commentOwner = 1;
      }
      comment.canDelete = canDelete;
      comment.commentOwner = commentOwner;
      delete comment.commentedBy;
    });
    // add comments to the link object
    linkDetail[0].comments = commentDetail;
    return sendResponse(res, 200, linkDetail[0], 'data fetched successfully');
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, [], 'bad request');
  }
})
  .patch(async (req, res) => {
    req.check('linkId', 'invalid').exists().isInt();
    const actionPerformerId = req.user.userId;
    const typeOfActionPerformer = req.user.userType;
    const { link, description } = req.body;
    const { linkId } = req.params;
    if (!link && !description) {
      return sendResponse(res, 422, [], 'missing parameters');
    }
    const updateValues = [];
    if (link) {
      if (!isValidLink(link)) {
        return sendResponse(res, 422, [], 'Invalid link');
      }
      updateValues.push(`link = '${link}'`);
    }
    if (description) {
      if (description.length < 4) {
        return sendResponse(res, 422, [], 'Invalid link');
      }
      updateValues.push(`description = '${description}'`);
    }
    let updateQuery = 'UPDATE links SET ';
    if (updateValues.length > 0) {
      updateQuery += updateValues.join();
    }
    updateQuery += ` WHERE id = ${linkId}`;
    console.log(updateQuery);
    try {
      // get user who created link
      const [row] = await pool.query(`SELECT createdBy FROM links WHERE id = ${linkId}`);

      if (row.length === 0) {
        return sendResponse(res, 404, [], 'not found');
      }
      // check type of user if its admin then update
      if (typeOfActionPerformer === 1) {
        // run update query because use is admin
        await pool.query(updateQuery);

        return sendResponse(res, 200, [], 'data updated');
      } else if (actionPerformerId === row[0].createdBy) {
        // run update query
        await pool.query(updateQuery);

        return sendResponse(res, 200, [], 'data updated');
      }
      return sendResponse(res, 405, [], 'not allowed');
    } catch (err) {
      console.log(err);
      return sendResponse(res, 500, [], 'bad request');
    }
  })
  .delete(async (req, res) => {
    const onlyDigitRegex = /^\d+$/;
    if (!onlyDigitRegex.test(req.params.id)) {
      return sendResponse(res, 422, [], 'invalid parameter');
    }
    req.check('id', 'id is required/ must be an integer').exists().isInt();
    const idToBeDeleted = req.params.id;
    console.log(req.user);
    const idOfActionPerformer = req.user.userId;
    const typeOfActionPerformer = req.user.userType;
    try {
      const [row] = await pool.query(`SELECT createdBy FROM links WHERE id = '${idToBeDeleted}`);
      // validate data from db
      if (row.length === 0) {
        return sendResponse(res, 404, [], 'not found');
      }

      // check typeOfAction performer is admin
      if (typeOfActionPerformer === 1) {
        const [deletedData] = await pool.query(`DELETE FROM links WHERE id = '${idToBeDeleted}'`);
        console.log(deletedData);
      }

      // check idOfActionPerformer is the owner of link if yes than it can be delete
      if (idOfActionPerformer === row.createdBy) {
        const [deletedData] = await pool.query(`DELETE FROM links WHERE id = '${idToBeDeleted}'`);
        console.log(deletedData);
      }
    } catch (err) {
      console.log(err);
      return sendResponse(res, 403, [], 'forbidden');
    }
    return sendResponse(res, 400, [], 'Unauthorised user');
  });

module.exports = linkRoutes;
