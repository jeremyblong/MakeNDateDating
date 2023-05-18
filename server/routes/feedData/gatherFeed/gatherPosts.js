const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

router.get("/", (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const {} = req.query;

    collection.find({ feedPosts: { $exists: true } }).limit(20).toArray((err, posts) => {
        if (err) {
            console.log(err.message);

            response.json({
                err,
                message: "Could not find users, error occurred."
            })
        } else {
            const newPostArray = [];

            new Promise((resolve, reject) => {
                for (let index = 0; index < posts.length; index++) {
                    const post = posts[index];
                    
                    if (typeof post.feedPosts !== "undefined" && post.feedPosts.length > 0) {

                        for (let idxxx = 0; idxxx < post.feedPosts.length; idxxx++) {
                            const innerElement = post.feedPosts[idxxx];
                            
                            newPostArray.push(innerElement);

                            if (((posts.length - 1) === index) && ((post.feedPosts.length - 1) === idxxx)) {
                                resolve();
                            }
                        };
                    }
                }
            }).then(() => {
                response.json({
                    message: "Gathered list of posts!",
                    posts: newPostArray
                })
            })
        }
    })
});

module.exports = router;