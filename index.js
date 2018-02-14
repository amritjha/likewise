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
    User = require("./models/user");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/assets"));
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

//mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/likewise");

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", passport.authenticate("local", {
        successRedirect: "/dashboard",
        failureRedirect: "/"
    }), function(req, res) {
});

app.post("/signup", function(req, res) {
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

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

app.get("/dashboard", isLoggedIn, function(req, res) {
    res.render("dashboard");
});


app.post("/dashboard", isLoggedIn, function(req, res) {
    var post = req.body.post;
    posts.push(post);
    res.redirect("/dashboard");
});

app.get("*", function(req, res) {
    res.render("page-not-found");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) 
        return next();
    res.redirect("/login");
}

app.listen(4321, function() {
    console.log("serving likewise on http://127.0.0.1:4321");
});