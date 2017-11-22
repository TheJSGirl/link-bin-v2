const userRoutes = require('express').Router();
const pool = require('../../db');
const { sendResponse } = require('../../helpers');
const bcrypt = require('bcrypt');


userRoutes.route('/').get(async (req, res) => {
  try {
    const [result] = await pool.query(`SELECT * FROM users WHERE isActive = ${1}`);
    // console.log(result);

    // removing password field of every user
    result.map((item) => {
      console.log(item);
      delete item.password;
    });
    return sendResponse(res, 200, result, 'successful');
  } catch (err) {
    console.log(err);
    return sendResponse(res, 500, [], 'something went wrong');
  }
});

userRoutes.route('/:id').get(async (req, res) => {
  const { id } = req.params;
  try {
    const [data] = await pool.query(`SELECT * FROM users WHERE id = '${id}'`);
    // console.log(data);
    return sendResponse(res, data, 'ok', 'successful', 200);
  } catch (err) {
    console.error(err);
    return sendResponse(res, [], 'failed', 'invalid id', 400);
  }
})
  .patch(async (req, res) => {
    // validate the req
    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({ min: 5 });
    const errors = req.validationErrors();
    if (errors) {
      return sendResponse(res, 422, [], errors[0].msg);
    }
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const { id } = req.params;
    try {
      const [newData] = await pool.query(`UPDATE users SET name = '${name}', password = '${hashedPassword}' WHERE id = '${id}'`);
      return sendResponse(res, newData, 'ok', 'updated successfully', 200);
    } catch (err) {
      console.log(err);
      return sendResponse(res, [], 'failed', 'something went wrong', 500);
    }
  })
  .delete(async (req, res) => {
    req.check('id', 'id is required/must be an integer').exists().isInt();
    const onlyDigitRegex = /^\d+$/;
    if (!onlyDigitRegex.test(req.params.id)) {
      return sendResponse(res, 422, [], 'invalid parameter');
    }

    const idToBeDeleted = req.params.id;

    console.log(req.user);
    const idOfActionPerformer = req.user.userId;
    const typeOfActionPerformer = req.user.userType;
    try {
      if (idOfActionPerformer === idToBeDeleted) { // the user is deleting his/her own account
        // console.log('user is deleting his/her own account');
        await pool.query(`UPDATE users SET isActive = ${0} WHERE id = ${idToBeDeleted}`);
        return sendResponse(res, 200, [], 'user deleted');
      } else if (typeOfActionPerformer === 1) { // the user is an admin so he/she can delete an user
        // console.log('admin is deleting the user');
        await pool.query(`UPDATE users SET isActive = ${0} WHERE id = ${idToBeDeleted}`);
        return sendResponse(res, 200, [], 'user deleted');
      }

      return sendResponse(res, 405, [], 'not allowed');
    } catch (err) {
      console.log(err);
      return sendResponse(res, 500, [], 'Something went wrong');
    }
  });

module.exports = userRoutes;
