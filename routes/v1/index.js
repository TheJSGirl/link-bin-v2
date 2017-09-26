const mainRoute = require('express').Router();

const registerRoutes = require('./registerRoutes');

mainRoute.use('/register', registerRoutes);

module.exports = mainRoute;