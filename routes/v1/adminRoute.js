const adminRoute = require('express').Router();
const { sendResponse } = require('../../helpers');
const pool = require('../../db');

adminRoute.route('/').get(async (req, res) => {
  const { userId } = req.user;
  try {
    const [userRow] = await pool.query(`SELECT name FROM users WHERE id = ${userId}`);

    console.log(userRow);

    if (userRow.length === 0) {
      return sendResponse(res, 404, [], 'user not found');
    }
    const nameOfUser = userRow[0].name;
    return sendResponse(res, 200, [], `Welcome ${nameOfUser}, this is admin area`);
  }
  catch (err) {
    console.err(err);
    return sendResponse(res, 500, [], 'something went wrong');
  }
});

module.exports = adminRoute;
