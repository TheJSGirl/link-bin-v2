const mainRoute = require('express').Router();

const regesterRoutes = require('./registerRoutes');

mainRoute.use('/register', registerRoutes);

module.exports = mainRoute;