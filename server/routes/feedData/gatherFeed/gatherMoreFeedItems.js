const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

router.get("/", (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const {
        idsAlreadyIncluded 
    } = req.query;

    collection.find({ "feedPosts.id": { $nin: idsAlreadyIncluded }, feedPosts: { $exists: true }}).limit(20).toArray((err, posts) => {
        if (err) {
            console.log(err.message);

            response.json({
                err,
                message: "Could not find posts, error occurred."
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
                console.log("concludded...");

                response.json({
                    message: "Successfully fetched new posts/results!",
                    posts: newPostArray
                })
            })
        }
    })
});

module.exports = router;