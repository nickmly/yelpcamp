var express = require('express');
var router = express.Router({mergeParams:true});
var User = require('../models/user.js');

router.get("/:id", function(req,res){
    User.findById(req.params.id).populate("comments").exec(function(err, user){
        if(err){
            console.log(err);
        } else {
            res.render("user/show", {user: user});
        }
    });
});

module.exports = router;