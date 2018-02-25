var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    expressSession = require("express-session"),
    passport = require("passport"),
    passportLocal = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash = require("connect-flash"),
    app = express(),
    Comment = require("./models/comment"),
    Post = require("./models/post"),
    User = require("./models/user"),
    seedDB = require("./seed");

var commentsRoutes = require("./routes/comments"),
    postsRoutes = require("./routes/posts"),
    connectionsRoutes = require("./routes/connections"),
    indexRoutes = require("./routes/index");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/assets"));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
    secret: "secret auth statment for likewise",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost:27017/likewise");
// seedDB();

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);
app.use("/", postsRoutes);
app.use("/", commentsRoutes);
app.use("/", connectionsRoutes);

app.get("*", function(req, res) {
    res.render("page-not-found");
});

app.listen(4321, function() {
    console.log("serving likewise on http://127.0.0.1:4321");
});