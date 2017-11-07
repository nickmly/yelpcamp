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
    image: String
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
            res.render("campgrounds", {campgrounds: campgrounds});
        }
    });
});

app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});


app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var img = req.body.image;
    // Add campground found in form to DB
    Campground.create({
        name: name,
        image: img
    }, function(err, campground){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

////////////////////////////////
////////////////////////////////


// Server listening for routes
app.listen(3000, process.env.IP, function(){
    console.log("Server has started!");
});