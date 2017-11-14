var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground.js");
var Comment = require("../models/comment.js");
var isLoggedIn = require("../isLoggedIn.js");

////////////////////////////////
// COMMENT ROUTES
////////////////////////////////

// COMMENT NEW
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comment/new", { campground: foundCamp });
        }
    });
});

// COMMENT CREATE
router.post("/", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to commment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    // save comment
                    comment.save();

                    req.user.comments.push(comment);
                    req.user.save();                    

                    foundCamp.comments.push(comment);
                    foundCamp.save();
                  
                    res.redirect("/campgrounds/" + foundCamp._id);
                }
            });
        }
    });
});

////////////////////////////////
////////////////////////////////

module.exports = router;