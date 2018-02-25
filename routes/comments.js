var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../models/comment");
var Post = require("../models/post");
var middleware = require("../middleware/index.js");

router.post("/posts/:id/comments", middleware.isLoggedIn, function(req, res) {
    Post.findById(req.params.id, function(err, post) {
        if(err) {
            res.redirect("/dashboard");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(!err) {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    post.comments.push(comment);
                    res.redirect("/posts/" + post._id);
                }
            });
        }
    });
});

router.get("/posts/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
            res.redirect("back");
        } else {
            res.render("edit-comment", {post_id: req.params.id, comment: comment});
        }
    });
});

router.put("/posts/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

router.delete("/posts/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if(err) {
            res.redirect("back");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

/*
function checkCommentOwnership(req, res, next) {
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
}*/

module.exports = router;