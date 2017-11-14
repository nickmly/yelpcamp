var express = require("express");
var router = express.Router();
var Campground = require("../models/campground.js");
var isLoggedIn = require("../isLoggedIn.js");

////////////////////////////////
// CAMPGROUND ROUTES
////////////////////////////////
// INDEX
router.get("/", function (req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campground/index", { campgrounds: campgrounds});
        }
    });
});

// NEW
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campground/new");
});

// CREATE
router.post("/", isLoggedIn, function (req, res) {
    var name = req.body.name;
    var img = req.body.image;
    var desc = req.body.desc;
    
    // Add campground found in form to DB
    Campground.create({
        name: name,
        image: img,
        desc: desc,        
    }, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
            res.redirect("/campgrounds");
        }
    });
});

// SHOW
router.get("/:id", function (req, res) {
    // Find campground with ID and populate comments array
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            //Render the found campground
            res.render("campground/show", { campground: foundCamp });
        }
    });
});

module.exports = router;