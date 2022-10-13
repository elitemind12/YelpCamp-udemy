const isLoggedIn = (req, res, next) => {
    console.log(req.path, req.originalUrl);
    if(!req.isAuthenticated()){
        req.flash('error', 'you must signed in first');
        return res.redirect('/login');
    }
    next();
}


module.exports = isLoggedIn;