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
            res.render("campground/index", { campgrounds: campgrounds });
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

// EDIT
router.get("/:id/edit", checkOwner, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        res.render("campground/edit", { campground: foundCamp });
    });
});

// UPDATE
router.put("/:id", checkOwner, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, foundCamp) {
        res.redirect("/campgrounds/" + req.params.id);        
    });
});

// DELETE
router.delete("/:id", checkOwner, function (req, res) {
    Campground.findByIdAndRemove(req.params.id, function (err, camp) {
        res.redirect("/campgrounds");        
    });
});

// Checks if user owns a campground
function checkOwner(req, res, next) {
    // If logged in
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCamp) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                // If they own this campground
                if (foundCamp.author.id.equals(req.user._id)) {
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

module.exports = router;