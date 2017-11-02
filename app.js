var express = require('express');
var app = express();

app.set("view engine", "ejs");



////////////////////////////////
// ROUTES
////////////////////////////////
app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){
    var campgrounds = [
        {name: "Salmon Creek", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Salmon_Creek.jpg/1200px-Salmon_Creek.jpg"},
        {name: "Mountains", image: "https://www.nps.gov/lacl/planyourvisit/images/Image-w-cred-cap_-1200w-_-Visit-Silver-Salmon-Creek-Page_2.jpg"}
    ];

    res.render("campgrounds", {campgrounds: campgrounds});
});


////////////////////////////////
////////////////////////////////


// Server listening for routes
app.listen(3000, process.env.IP, function(){
    console.log("Server has started!");
});