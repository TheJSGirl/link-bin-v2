const mainRoute = require('express').Router();
const checkAuth = require('./../../middlewares');
const registerRoute = require('./registerRoutes');
const loginRoute   = require('./loginRoutes'); 
const feedsRoute   = require('./feedsRoute'); 

mainRoute.use('/register', registerRoute);
mainRoute.use('/login', loginRoute);
mainRoute.use('/feeds', checkAuth, feedsRoute);

module.exports = mainRoute;