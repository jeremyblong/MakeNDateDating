const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const axios = require("axios");
const config = require("config");
const _ = require("lodash");

router.get("/", (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const { sizeOfResults } = req.query;

    collection.find({ itemsForSale: { $exists: true } }).limit(Number(sizeOfResults)).toArray((err, posts) => {
        if (err) {
            console.log(err.message);

            response.json({
                err,
                message: "Could not find users, error occurred."
            })
        } else {
            const newResultsArr = [];

            new Promise((resolve, reject) => {
                for (let index = 0; index < posts.length; index++) {
                    const post = posts[index];
                    
                    if (typeof post.itemsForSale !== "undefined" && post.itemsForSale.length > 0) {
                        for (let idxxx = 0; idxxx < post.itemsForSale.length; idxxx++) {
                            const element = post.itemsForSale[idxxx];
                            
                            newResultsArr.push(element);
                        }
                    }

                    if ((posts.length - 1) === index) {
                        resolve();
                    }
                }
            }).then(() => {

                console.log("newResultsArr", newResultsArr.length);

                const promises = [];

                for (let index = 0; index < newResultsArr.length; index++) {
                    const coreUserData = newResultsArr[index];
                    
                    promises.push(new Promise((resolve, reject) => {
                        // update comments state
                        const configuration = {
                            params: {
                                postedByID: coreUserData.posterID
                            }
                        };
                        axios.get(`${config.get("baseURL")}/gather/only/profile/picture/with/id`, configuration).then((res) => {
                            if (res.data.message === "Submitted gathered user's picture/file!") {
    
                                const { user } = res.data; 
        
                                coreUserData["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
        
                                resolve(coreUserData);
                            } else {
        
                                coreUserData["lastProfilePic"] = null;
        
                                resolve(coreUserData);
                            }
                        }).catch((err) => {
                            coreUserData["lastProfilePic"] = null;
        
                            resolve(coreUserData);
                        })
                    }));
                }

                Promise.all(promises).then((passedValues) => {

                    console.log("passedValues", passedValues);

                    response.json({
                        message: "Gathered listings!",
                        listings: passedValues
                    })
                })
            })
        }
    })
});

module.exports = router;