// Middleware function to check if user is logged in
// Next is the function that will run if user is logged in
// If not, redirect to login page
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//////

module.exports = isLoggedIn;