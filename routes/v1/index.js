const mainRoute = require('express').Router();

const registerRoutes= require('./registerRoutes');
const loginRoutes   = require('./loginRoutes'); 

mainRoute.use('/register', registerRoutes);
mainRoute.use('/login', loginRoutes);

module.exports = mainRoute;