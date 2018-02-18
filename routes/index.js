var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index.js");

router.get("/", function(req, res) {
    res.render("home");
});

router.get("/login", passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/"
    }), function(req, res) {
});

router.post("/signup", function(req, res) {
    var newUser = {
        firstName: req.body.firstname, 
        lastName: req.body.lastname, 
        username: req.body.username,
        email: req.body.email
    };
    User.register(new User(newUser), req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("home");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/dashboard");
        });
    });
});

router.get("/logout", middleware.isLoggedIn, function(req, res){
    req.logout();
    res.redirect("/");
});

module.exports = router;