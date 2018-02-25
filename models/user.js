var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    email: String,
    password: String,
    connectionRequestsReceived: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    } ],
    connectionRequestsSent: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    } ],
    allConnections: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    } ]
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);

