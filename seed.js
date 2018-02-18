var mongoose = require("mongoose");
var Post = require("./models/post");
var Comment = require("./models/comment");

var data = [
    {
        title: "Post #1",
        textContent: "I am currently exploring the field of artificial intelligence"
    },
    {
        title: "Post #2",
        textContent: "I am also learning algorithms & data-structures"
    },
    {
        title: "Post #3",
        textContent: "I am keenly looking for opportunities of working with research teams"
    }
    
]
function seedDB() {
    Post.remove({}, function(err) {
        if(!err) {
            data.forEach(function(seedData) {
                Post.create(seedData, function(err, post) {
                    if(!err) {
                        console.log("post added to Post through seeding");
                        Comment.create({
                            text: "it was a great read",
                            author: "Abhisekh"
                        }, function(err, comment) {
                            if(!err) {
                                post.comments.push(comment);
                                post.save();
                                console.log("comment added");
                            }
                        });
                    }
                });
            });
        }
    });
}

module.exports = seedDB;