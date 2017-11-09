////////////////////////////////
// REQUIREMENTS
////////////////////////////////
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    seedDB = require('./seeds.js');

////////////////////////////////
////////////////////////////////

// Connect to monogoDB
mongoose.connect("mongodb://localhost/yelp_camp");

// Use body parser for easy parsing
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// Get all models from files
var Campground = require('./models/campground.js'),
    Comment = require('./models/comment.js');


// Seed the database
seedDB();

////////////////////////////////
// ROUTES
////////////////////////////////
app.get("/", function(req,res){
    res.render("landing");
});

// INDEX
app.get("/campgrounds", function(req,res){    
    //Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("campground/index", {campgrounds: campgrounds});
        }
    });
});

// NEW
app.get("/campgrounds/new", function(req,res){
    res.render("campground/new");
});

// CREATE
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var img = req.body.image;
    var desc = req.body.desc;
    // Add campground found in form to DB
    Campground.create({
        name: name,
        image: img,
        desc: desc
    }, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// SHOW
app.get("/campgrounds/:id", function(req,res){
    // Find campground with ID and populate comments array
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
        if(err) {
            console.log(err);
        } else {
            //Render the found campground
            res.render("campground/show", {campground: foundCamp});
        }
    });
});

////////////////////////////////
// COMMENT ROUTES
////////////////////////////////

// COMMENT NEW
app.get("/campgrounds/:id/comments/new", function(req,res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err) {
            console.log(err);
        } else {
            res.render("comment/new", {campground: foundCamp});
        }
    });
});

// COMMENT CREATE
app.post("/campgrounds/:id/comments", function(req,res){
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                } else {
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


// Server listening on port 3000 for routes
app.listen(3000, process.env.IP, function(){
    console.log("Server has started!");
});