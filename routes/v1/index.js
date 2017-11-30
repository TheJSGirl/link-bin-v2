const mainRoute = require('express').Router();
const registerRoute = require('./registerRoutes');
const loginRoute   = require('./loginRoute'); 
const feedsRoute   = require('./feedsRoute'); 
const adminRoute = require('./adminRoute');
const managerRoute = require('./managerRoute');

const { isAdmin, isManager, checkAuth } = require('../../middlewares');

mainRoute.use('/register', registerRoute);
mainRoute.use('/login', loginRoute);
mainRoute.use('/feeds', checkAuth, feedsRoute);
mainRoute.use('/admin', checkAuth, isAdmin, adminRoute);
mainRoute.use('/manager',checkAuth,isManager, managerRoute);
module.exports = mainRoute;