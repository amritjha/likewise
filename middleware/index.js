var Post = require("../models/post");
var Comment = require("../models/comment");

var middlewares = {};

middlewares.checkPostOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Post.findById(req.params.id, function(err, resultPost) {
            if(!err) {
                if(resultPost.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });    
    } else {
        res.redirect("back");
    }
}

middlewares.checkCommentOwnership = function(req, res, next) { 
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, resultComment) {
            if(!err) {
                if(resultComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });    
    } else {
        res.redirect("back");
    }
}

middlewares.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) 
        return next();
    res.redirect("/login");
}

module.exports = middlewares;