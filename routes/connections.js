var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware/index.js");

router.get("/connections", middleware.isLoggedIn, function(req, res) {
    User.findById(req.user._id).populate("allConnections").populate("connectionRequestsReceived").populate("connectionRequestsSent").exec(function(err, user) {
        console.log(user);
        res.render("connections", {user: user});
    });
});

router.post("/request-connection", middleware.isLoggedIn, function(req, res) {
    var requestedConnection = req.body.req_conn_username;
    User.find({username: requestedConnection}, function(err, user) {
        if(!err) {
            user[0].connectionRequestsReceived.push(req.user._id);
            user[0].save();
            req.user.connectionRequestsSent.push(user[0]._id);
            req.user.save();
            res.render("connections");
        } else {
            res.send("something went wrong");
        }
    });
});

module.exports = router;