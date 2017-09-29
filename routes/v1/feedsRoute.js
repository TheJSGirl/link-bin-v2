const feedsRoute = require('express').Router();
const pool  = require('../../db');
const {sendResponse} = require('../../helpers');


feedsRoute.route('/')
    .get(async (req, res) => {
        return sendResponse(res, [], 'ok', 'Welcome to feeds', 200);
    });

module.exports = feedsRoute;