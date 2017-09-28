const feedsRoute = require('express').Router();
const pool  = require('../../db');


feedsRoute.route('/')
    .get(async (req, res) => {
        res.status(200).json({
            status: 'success',
            message: 'welcome to feeds'
        });
    });

module.exports = feedsRoute;