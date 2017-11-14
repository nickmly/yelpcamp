var mongoose = require('mongoose'),
    Campground = require('./models/campground.js'),
    Comment = require('./models/comment.js');


var data = [
    {
        name: "Cloud's Rest",
        image: "https://i.ytimg.com/vi/N5qLVlSzaQ0/maxresdefault.jpg",
        desc: "A mountain top"
    },
    {
        name: "Lucky Lake",
        image: "http://luckylake.ca/images/slide2.jpg",
        desc: "A lake with water"
    },
    {
        name: "Desert Mesa",
        image: "https://images.fineartamerica.com/images-medium-large-5/arizona-desert-mesa-gene-sherrill.jpg",
        desc: "A desert without water"
    }
];

function seedDB() {
    // Empty database
    Campground.remove({}, function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("emptied database")
            // Add test campgrounds
            // data.forEach(function (campground) {
            //     Campground.create(campground, function (err, data) {
            //         if (err) {
            //             console.log(err);
            //         } else {
            //             console.log("added campground to db");
            //             // create a comment
            //             Comment.create({
            //                 text: "This place is great",
            //                 author: "Homer"
            //             }, function (err, comment) {
            //                 if (err) {
            //                     console.log(err);
            //                 } else {
            //                     console.log("created new comment");
            //                     data.comments.push(comment);
            //                     data.save();
            //                 }
            //             });
            //         }
            //     });
            // });
        }
    });
}

module.exports = seedDB;