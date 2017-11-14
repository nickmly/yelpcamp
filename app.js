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

// Get all routes from files
var commentRoutes = require('./routes/comments.js'),
    campgroundRoutes = require('./routes/campgrounds.js'),
    authRoutes = require('./routes/auth.js'),
    userRoutes = require('./routes/users.js');



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
//seedDB();

// Set user data to be sent through every route
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

////////////////////////////////
// ROUTES
////////////////////////////////

// Use routes
app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes); // All comment routes start with /campgrounds/:id/comments
app.use("/campgrounds", campgroundRoutes); // All campground routes start with /campgrounds
app.use("/user", userRoutes);
app.get("/", function (req, res) {
    res.render("landing");
});
////////////////////////////////
////////////////////////////////

// Server listening on port 3000 for routes
app.listen(3000, process.env.IP, function () {
    console.log("Server has started!");
});