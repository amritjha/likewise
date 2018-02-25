var express = require("express");
var router = express.Router();
var Post = require("../models/post");
var middleware = require("../middleware/index.js");

router.get("/dashboard", middleware.isLoggedIn, function(req, res) {
    Post.find({}, function(err, posts) {
        if(err) {
            console.log(err);
        } else {
            res.render("dashboard", {posts: posts});    
        }
    });
});

router.post("/newpost", middleware.isLoggedIn, function(req, res) {
    var title = req.body.newpost_title;
    var textContent = req.body.newpost_text;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newPost = {
        title: title, textContent: textContent, author: author
    }
    Post.create(newPost, function(err, newlyCreatedPost) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/dashboard");    
        }
    });  
});

router.get("/posts/:id", function(req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, post) {
        if(err) {
            console.log(err);
        } else {
            res.render("full-post", {post: post}); 
        }
    });
});

router.get("/posts/:id/edit", middleware.checkPostOwnership, function(req, res) {
    Post.findById(req.params.id, function(err, resultPost) {
        res.render("edit-post", {post: resultPost});    
    });    
});

router.put("/posts/:id", middleware.checkPostOwnership, function(req, res) {
    Post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost) {
        if(!err) {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

router.delete("/posts/:id", middleware.checkPostOwnership, function(req, res) {
    Post.findByIdAndRemove(req.params.id, function(err) {
        res.redirect("/dashboard");
    });
});

module.exports = router;