const mainRoute = require('express').Router();
const {checkAuth, isAdmin} = require('../../middlewares');
const userRoute = require('./userRoutes');

mainRoute.use('/users',checkAuth, userRoute); 


module.exports = mainRoute;