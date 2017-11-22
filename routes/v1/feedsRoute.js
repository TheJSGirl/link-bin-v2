const feedsRoute = require('express').Router();
// const pool  = require('../../db');
const { sendResponse } = require('../../helpers');


feedsRoute.route('/')
  .get((req, res) => sendResponse(res, 200, [], 'Welcome to feeds'));

module.exports = feedsRoute;
