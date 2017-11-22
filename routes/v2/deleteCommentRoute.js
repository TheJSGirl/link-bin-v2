const deleteCommentRoute = require('express').Router();
const pool = require('../../db');
const { sendResponse } = require('../../helpers');
const expressValidator = require('express-validator');


deleteCommentRoute.route('/:commentId').delete(async (req, res) => {
  const actionUser = req.user.userId;
  const typeOfUser = req.user.userType;
  const idToBeDeleted = req.params.commentId;
  // validation
  req.checkBody('idToBeDeleted', 'id is require').exists();
  console.log('req.user => ', req.user);
  try {
    const [user] = await pool.query(`SELECT commentedBy FROM comments WHERE id = ${idToBeDeleted}`); console.log('user data: ', user[0]);
    if (user.length === 0) {
      return sendResponse(res, 404, [], 'not found');
    }
    if (typeOfUser === 1) {
      // admin can delete
      const [deletedData] = await pool.query(`DELETE  FROM comments WHERE id = ${idToBeDeleted}`);
      return sendResponse(res, 200, [], 'data deleted successfully');
    }
    if (actionUser === user[0].commentedBy) {
      // than delete
      const [deletedData] = await pool.query(`DELETE  FROM comments WHERE id = ${idToBeDeleted}`);
      return sendResponse(res, 200, [], 'data deleted successfully');
    }
    return sendResponse(res, 403, [], 'you are not allowed to perform this action');
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, [], 'Something went wrong');
  }
});

module.exports = deleteCommentRoute;
