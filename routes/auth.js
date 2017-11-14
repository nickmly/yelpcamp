var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user.js");
var isLoggedIn = require("../isLoggedIn.js");

////////////////////////////////
// AUTH ROUTES
////////////////////////////////
router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("/register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/campgrounds");
        });

    });
});

router.get("/login", function(req,res){
    res.render("login");
});

// Login with passport authentication
// If user entered correct info, go to campgrounds page
// Otherwise go to login page again
router.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){
    
});

router.get("/logout", function(req,res){
    req.logout();// Built in passport function for logging out
    res.redirect("/campgrounds");
});

//////////////////////////
////////////////////////////////

module.exports = router;