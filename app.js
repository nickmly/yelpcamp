////////////////////////////////
// REQUIREMENTS
////////////////////////////////
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    mongoose = require('mongoose'),
    seedDB = require('./seeds.js');

////////////////////////////////
////////////////////////////////

// Get all models from files
var Campground = require('./models/campground.js'),
    Comment = require('./models/comment.js'),
    User = require('./models/user.js');

// Connect to mongoDB
mongoose.connect("mongodb://localhost/yelp_camp");

// Use body parser for easy parsing
app.use(bodyParser.urlencoded({ extended: true }));

////////////////////////////////
// PASSPORT CONFIG
////////////////////////////////
app.use(require('express-session')({
    secret: "Once again Rusty wins",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
////////////////////////////////
////////////////////////////////

// Use public directory
app.use(express.static(__dirname + "/public"));

// Don't have to type .ejs for each res.render func call
app.set("view engine", "ejs");

// Seed the database (seeds.js)
seedDB();

// Set user data to be sent through every route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});
////////////////////////////////
// ROUTES
////////////////////////////////
app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX
app.get("/campgrounds", function (req, res) {
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
app.get("/campgrounds/new", isLoggedIn, function (req, res) {
    res.render("campground/new");
});

// CREATE
app.post("/campgrounds", isLoggedIn, function (req, res) {
    var name = req.body.name;
    var img = req.body.image;
    var desc = req.body.desc;
    // Add campground found in form to DB
    Campground.create({
        name: name,
        image: img,
        desc: desc
    }, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

// SHOW
app.get("/campgrounds/:id", function (req, res) {
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

////////////////////////////////
// COMMENT ROUTES
////////////////////////////////

// COMMENT NEW
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comment/new", { campground: foundCamp });
        }
    });
});

// COMMENT CREATE
app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCamp) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
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

////////////////////////////////
// AUTH ROUTES
////////////////////////////////
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
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

app.get("/login", function(req,res){
    res.render("login");
});

// Login with passport authentication
// If user entered correct info, go to campgrounds page
// Otherwise go to login page again
app.post("/login", passport.authenticate("local", 
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req,res){
    
});

app.get("/logout", function(req,res){
    req.logout();// Built in passport function for logging out
    res.redirect("/campgrounds");
});
////////////////////////////////
////////////////////////////////

// Middleware function to check if user is logged in
// Next is the function that will run if user is logged in
// If not, redirect to login page
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// Server listening on port 3000 for routes
app.listen(3000, process.env.IP, function () {
    console.log("Server has started!");
});