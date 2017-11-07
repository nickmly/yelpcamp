var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

////////////////////////////////
// SCHEMA SETUP
////////////////////////////////
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

////////////////////////////////
////////////////////////////////

////////////////////////////////
// ROUTES
////////////////////////////////
app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){    
    //Get all campgrounds from DB
    Campground.find({}, function(err, campgrounds){
        if(err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: campgrounds});
        }
    });
});

app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});

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

app.get("/campgrounds/:id", function(req,res){
    // Find campground with ID
    Campground.findById(req.params.id, function(err, foundCamp){
        if(err) {
            console.log(err);
        } else {
            //Render the found campground
            res.render("show", {campground: foundCamp});
        }
    });
});

////////////////////////////////
////////////////////////////////


// Server listening on port 3000 for routes
app.listen(3000, process.env.IP, function(){
    console.log("Server has started!");
});