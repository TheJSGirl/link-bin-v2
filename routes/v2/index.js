const mainRoute = require('express').Router();
const {checkAuth, isAdmin} = require('../../middlewares');
const userRoutes = require('./userRoutes');
const linkRoutes = require('./linkRoutes');

mainRoute.use('/users',checkAuth, userRoutes); 
mainRoute.use('/links',checkAuth,linkRoutes);


module.exports = mainRoute;