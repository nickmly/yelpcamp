var mongoose = require('mongoose');
////////////////////////////////
// SCHEMA SETUP
////////////////////////////////
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String
});

module.exports = mongoose.model("Campground", campgroundSchema);
