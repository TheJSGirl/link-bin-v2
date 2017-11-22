const mainRoute = require('express').Router();
const { checkAuth, isAdmin } = require('../../middlewares');
const userRoutes = require('./userRoutes');
const linkRoutes = require('./linkRoutes');
const commentRoutes = require('./commentRoutes');
const deleteCommentRoute = require('./deleteCommentRoute');

mainRoute.use('/users', checkAuth, userRoutes); 
mainRoute.use('/links', checkAuth,linkRoutes);
mainRoute.use('/links', checkAuth, isAdmin, commentRoutes);
mainRoute.use('/comments', checkAuth, isAdmin, deleteCommentRoute );

module.exports = mainRoute;