const mainRoute = require('express').Router();

const regesterRoutes = require('./regesterRoutes');

mainRoute.use('/register', regesterRoutes);

module.exports = mainRoute;