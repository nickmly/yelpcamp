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
                    comment.campground = foundCamp;

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

// COMMENT EDIT
router.get("/:comment_id/edit", checkOwner, function(req,res){
    Comment.findById(req.params.comment_id, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {  
            res.render("comment/edit", {comment: comment, campground_id: req.params.id});
        }
    });
});

// COMMENT UPDATE
router.put("/:comment_id", checkOwner, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// COMMENT DELETE
router.delete("/:comment_id", checkOwner, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment){
        res.redirect("/campgrounds/" + req.params.id);
    })
});

function checkOwner(req,res,next){
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, comment){
            if(err) {
                console.log(err);
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("/login");
    }
}

////////////////////////////////
////////////////////////////////

module.exports = router;