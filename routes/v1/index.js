const mainRoute = require('express').Router();
const checkAuth = require('./../../middlewares');
const registerRoute = require('./registerRoutes');
const loginRoute   = require('./loginRoutes'); 
const feedsRoute   = require('./feedsRoute'); 
const adminRoute  = require('./adminRoute');
const isAdmin = require('../../middlewares/isAdmin'); 


mainRoute.use('/register', registerRoute);
mainRoute.use('/login', loginRoute);
mainRoute.use('/feeds', checkAuth, feedsRoute);
mainRoute.use('/admin', checkAuth, isAdmin, adminRoute);
module.exports = mainRoute;