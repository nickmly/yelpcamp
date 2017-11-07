var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Salmon Creek", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Salmon_Creek.jpg/1200px-Salmon_Creek.jpg"},
    {name: "Mountains", image: "https://www.nps.gov/lacl/planyourvisit/images/Image-w-cred-cap_-1200w-_-Visit-Silver-Salmon-Creek-Page_2.jpg"},
    {name: "Colorado", image: "http://www.campoutcolorado.com/wp-content/grand-media/image/camp-out-colorado-carter-lake-pine-campground.jpg"},
    {name: "Salmon Creek", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Salmon_Creek.jpg/1200px-Salmon_Creek.jpg"},
    {name: "Mountains", image: "https://www.nps.gov/lacl/planyourvisit/images/Image-w-cred-cap_-1200w-_-Visit-Silver-Salmon-Creek-Page_2.jpg"},
    {name: "Colorado", image: "http://www.campoutcolorado.com/wp-content/grand-media/image/camp-out-colorado-carter-lake-pine-campground.jpg"}
];

////////////////////////////////
// ROUTES
////////////////////////////////
app.get("/", function(req,res){
    res.render("landing");
});

app.get("/campgrounds", function(req,res){   
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req,res){
    res.render("new.ejs");
});


app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var img = req.body.image;
    campgrounds.push({
        name: name,
        image: img
    });
    res.redirect("/campgrounds");
});


////////////////////////////////
////////////////////////////////


// Server listening for routes
app.listen(3000, process.env.IP, function(){
    console.log("Server has started!");
});