const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const _ = require("lodash");

router.post("/", async (req, resppppp) => {

    const { otherUserData, accountType, uniqueId } = req.body;

    console.log("otherUserData", otherUserData);

    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");
    const collectionUsers = Connection.db.db("test").collection("users");

    const matchingUserCheckAuthedUser = await collection.findOne({ uniqueId });
    const otherUserAccountData = await collectionUsers.findOne({ uniqueId: otherUserData.uniqueId });
    // hideProfileViews

    if (_.has(matchingUserCheckAuthedUser, "hideProfileViews") && matchingUserCheckAuthedUser.hideProfileViews === true) {
        resppppp.json({
            message: "No view has been marked - restricted/hidden profile view upgrade."
        });
    } else {
        if (matchingUserCheckAuthedUser !== null && otherUserAccountData !== null) {

            const indexed = _.has(otherUserAccountData, "profileViews") ? otherUserAccountData.profileViews.findIndex((item) => item.viewerID === uniqueId) : -1;
            
            if (indexed === -1) {
                const newProfileViewObj = {
                    id: uuidv4(),
                    viewedOn: new Date(),
                    viewedOnString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
                    viewerID: uniqueId,
                    viewerAccountType: accountType,
                    viewerDisplayName: `${matchingUserCheckAuthedUser.firstName} ~ @${matchingUserCheckAuthedUser.username}`,
                    viewerUsername: matchingUserCheckAuthedUser.username
                }
            
                collection.findOneAndUpdate({ uniqueId: otherUserData.uniqueId }, { $push: {
                    profileViews: newProfileViewObj
                }}, { returnDocument: 'after' }, (errrrrrrr, doc) => {
                     if (errrrrrrr) {
                        console.log("errr", errrrrrrr);
    
                        resppppp.json({
                            message: "An error occurred while attempting to update DB information...",
                            err: errrrrrrr
                        });
                    } else {
                        console.log("Successfully ran...:", doc);
            
                        const { value } = doc;
                        
                        resppppp.json({
                            message: "Successfully saved profile view!",
                            otherUser: value
                        })
                    }
                });
            } else {
                resppppp.json({
                    message: "You've already been marked as a 'profile view' previously - no mark made..."
                });
            }
        } else {
            resppppp.json({
                message: "An error occurred while attempting to update DB information..."
            });
        }
    }
});

module.exports = router;