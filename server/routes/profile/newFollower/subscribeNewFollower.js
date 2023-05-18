const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const axios = require("axios");

router.post("/", async (req, resppppp) => {

    const { authedUserID, postedByID, username, firstName } = req.body;

    const collection = Connection.db.db("test").collection("users");

    const matchingUserCheck = await collection.findOne({ uniqueId: postedByID });
    const matchingUserCheckAuthedUser = await collection.findOne({ uniqueId: authedUserID });

    if (typeof matchingUserCheck.followers !== "undefined" && matchingUserCheck.followers.length > 0 && matchingUserCheck.followers.findIndex(e => e.followerID === authedUserID) !== -1) {
        collection.findOneAndUpdate({ uniqueId: postedByID }, { $pull: { 'followers': {
            "followerID": authedUserID
         }}}, { returnDocument: 'after' }, (err, doc) => {
             if (err) {
                console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror removed previous follow ==> :", err);

                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                });
            } else {
                const { value } = doc;

                console.log("Successfully REMOVED YOUR PREVIOUS FOLLOW as you've already followed this user:", doc);

                collection.findOneAndUpdate({ uniqueId: authedUserID }, { $pull: { 'followers': {
                    "followerID": postedByID
                 }}}, { returnDocument: 'after' }, (errrrrrrr, documentResp) => {
                     if (errrrrrrr) {
                        console.log("Errrrrrrrrrrrrrrrrrrrrrrrrrror removed previous follow ==> :", err);
        
                        resppppp.json({
                            message: "An error occurred while attempting to update DB information...",
                            err: errrrrrrr
                        });
                    } else {
                        console.log("Successfully REMOVED YOUR PREVIOUS FOLLOW as you've already followed this user:", documentResp);
                        
                        const promises = [];

                        if (typeof value.followers !== "undefined" && value.followers.length > 0) {
                            for (let idxxxxx = 0; idxxxxx < value.followers.length; idxxxxx++) {
                                const member = value.followers[idxxxxx];
                                
                                const { followerID } = member;
                    
                                promises.push(new Promise((resolve, reject) => {
                                    // update comments state
                                    const configuration = {
                                        params: {
                                            postedByID: followerID
                                        }
                                    };
                                    axios.get(`${config.get("baseURL")}/gather/only/profile/picture/with/id`, configuration).then((res) => {
                                        if (res.data.message === "Submitted gathered user's picture/file!") {
                
                                            const { user } = res.data; 
                    
                                            member["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
                    
                                            resolve(member);
                                        } else {
                    
                                            member["lastProfilePic"] = null;
                    
                                            resolve(member);
                                        }
                                    }).catch((err) => {
                                        member["lastProfilePic"] = null;
                    
                                        resolve(member);
                                    })
                                }));
                            };
                    
                            Promise.all(promises).then((passedValues) => {
                    
                                console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);
                    
                                resppppp.json({
                                    message: "You've already reacted/followed this user so we've assumed you wanted to unfollow this user, thus we unfollowed them for you.",
                                    otherUser: {
                                        ...value,
                                        followers: passedValues
                                    }
                                })
                            });
                        } else {
                            console.log("NO users available...!");
                        }
                    }
                });
            }
        });
    } else {
        const newFollower = {
            followerID: authedUserID,
            followerUsername: username, 
            followerFirstName: firstName,
            dateFollowed: new Date(),
            id: uuidv4()
        }
    
        collection.findOneAndUpdate({ uniqueId: postedByID }, { $push: { followers: newFollower } }, { returnDocument: 'after' },  (err, data) => {
            if (err) {
                console.log(err.message);
    
                resppppp.json({
                    message: "An error occurred while attempting to update DB information...",
                    err
                });
            } else {
                console.log("result", data);
    
                const { value } = data;
    
                const newFollowerSub = {
                    followingID: postedByID,
                    followingUsername: value.username, 
                    followingFirstName: value.firstName,
                    dateFollowed: new Date(),
                    id: uuidv4()
                }
    
                collection.findOneAndUpdate({ uniqueId: authedUserID }, { $push: { following: newFollowerSub } }, { returnDocument: 'after' },  (err, result) => {
                    if (err) {
                        console.log(err.message);
    
                        collection.findOneAndUpdate({ uniqueId: postedByID }, { $pull: { "followers.$.id": newFollower.id } }, { returnDocument: 'after' },  (err, result) => {
                            if (err) {
                                console.log(err.message);
                    
                                resppppp.json({
                                    message: "An error occurred while attempting to update DB information...",
                                    err
                                });
                            } else {
                                console.log("result", result);
                    
                                resppppp.json({
                                    message: "An error occurred - removed the previous reaction to other user..."
                                })
                            }
                        })
                    } else {
                        console.log("result", result);

                        const promises = [];

                        if (typeof value.followers !== "undefined" && value.followers.length > 0) {
                            for (let idxxxxx = 0; idxxxxx < value.followers.length; idxxxxx++) {
                                const member = value.followers[idxxxxx];
                                
                                const { followerID } = member;
                    
                                promises.push(new Promise((resolve, reject) => {
                                    // update comments state
                                    const configuration = {
                                        params: {
                                            postedByID: followerID
                                        }
                                    };
                                    axios.get(`${config.get("baseURL")}/gather/only/profile/picture/with/id`, configuration).then((res) => {
                                        if (res.data.message === "Submitted gathered user's picture/file!") {
                
                                            const { user } = res.data; 
                    
                                            member["lastProfilePic"] = (typeof user.profilePictures !== "undefined" && user.profilePictures.length > 0) ? user.profilePictures[user.profilePictures.length - 1] : null;
                    
                                            resolve(member);
                                        } else {
                    
                                            member["lastProfilePic"] = null;
                    
                                            resolve(member);
                                        }
                                    }).catch((err) => {
                                        member["lastProfilePic"] = null;
                    
                                        resolve(member);
                                    })
                                }));
                            };
                    
                            Promise.all(promises).then((passedValues) => {
                    
                                console.log("Promise passedValues passedValues passedValues passedValues....:", passedValues);
                    
                                resppppp.json({
                                    message: "Submitted subscribed as follower!",
                                    otherUser: {
                                        ...value,
                                        followers: passedValues
                                    }
                                })
                            });
                        } else {
                            console.log("NO users available...!");
                        }
                    }
                })
            }
        })
    }
});

module.exports = router;