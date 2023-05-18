const express = require("express");
const router = express.Router();
const { Connection } = require("../../../../mongoUtil.js");
const _ = require("lodash");
const axios = require("axios");
const config = require("config");

router.post("/", (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const {
        idsAlreadyIncluded,
        uniqueId
    } = req.body;

    console.log("req.body", req.body);

    const fetchCommentsToAddProfilePic = (users) => {

        const promises = [];
    
        if (typeof users !== "undefined" && users.length > 0) {
            for (let idxxxxx = 0; idxxxxx < users.length; idxxxxx++) {
                const userrrr = users[idxxxxx];
                
                promises.push(new Promise((resolve, reject) => {
                    // update comments state
                    const configuration = {
                        params: {
                            postedByID: userrrr.viewerID
                        }
                    };
                    axios.get(`${config.get("baseURL")}/gather/one/user/restricted/data`, configuration).then((res) => {
                        if (res.data.message === "Submitted gathered user's info!") {
        
                            const { user } = res.data; 
        
                            userrrr["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
                            userrrr["name"] = user.firstName;
                            userrrr["username"] = user.username;
                            
                            resolve(userrrr);
                        } else {
                            userrrr["lastProfilePic"] = null;
                            userrrr["name"] = null;
                            userrrr["username"] = null;
        
                            resolve(userrrr);
                        }
                    }).catch((err) => {
        
                        userrrr["lastProfilePic"] = null;
                        userrrr["name"] = null;
                        userrrr["username"] = null;
        
                        resolve(userrrr);
                    })
                }));
            };
    
            Promise.all(promises).then((passedValues) => {
    
                console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);
    
                response.json({
                    message: "Gathered list of users!",
                    users: passedValues
                })
                // setState(prevState => {
                //     return {
                //         ...prevState,
                //         notifications: passedValues.reverse()
                //     }
                // })
            });
        } else {
            console.log("NO notifications available...!");
        }
    }

    collection.findOne({ uniqueId }).then((user) => {
        if (!user) {
            console.log("User does NOT exist or could not be found.");

            resppppp.json({
                message: "User does NOT exist or could not be found.",
                err: null
            });
        } else {
            console.log("runnninggggg....");
            
            const newPostArray = [];

            new Promise((resolve, reject) => {
                if (typeof user.profileViews !== "undefined" && user.profileViews.length > 0) {
                    for (let index = 0; index < user.profileViews.length; index++) {
                        const userLooped = user.profileViews[index];
                        
                        newPostArray.push(userLooped);
    
                        if ((user.profileViews.length - 1) === index) {
                            resolve();
                        }
                    }
                } else {
                    resolve();
                }
            }).then(async () => {
                console.log("concludded...", idsAlreadyIncluded);

                const filtered = typeof newPostArray !== "undefined" && newPostArray.length > 0 ? newPostArray.filter((item) => !idsAlreadyIncluded.includes(item.viewerID)) : [];

                console.log("filtered....:", filtered);

                // fetch images for user profiles to display...
                if (typeof filtered !== "undefined" && filtered.length > 0) {
                    fetchCommentsToAddProfilePic(filtered);
                } else {
                    response.json({
                        message: "Gathered list of users!",
                        users: []
                    })
                }
            })
        }
    }).catch((err) => {
        console.log(err.message);

        resppppp.json({
            message: "Unknown error.",
            err
        })
    });
});

module.exports = router;