const isAdmin = (req, res, next) => {
    if(!req.user){
        return res.status(405).json({
            status: 'failed',
            err: 'not allowed'
        });
    }

    if(req.user.userType !== 1){
        return res.status(403).json({
            status: 'failed',
            err: 'resource is forbidden'
        });
    }

    next();
    
}

module.exports = isAdmin;