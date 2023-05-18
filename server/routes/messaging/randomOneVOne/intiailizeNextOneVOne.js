const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const NewRandomChat1v1Schema = require("../../../schemas/messaging/oneVOneRandomChatSchema.js");

router.post("/", async (req, resppppp) => {

    const collection = Connection.db.db("test").collection("random1v1chats");

    const { 
        uniqueId,
        firstName,
        username,
        ages,
        checkedGender,
        birthdate,
        gender
    } = req.body;

    const findAuthedUser = await collection.findOne({ uniqueId });

    if (checkedGender === "Everyone/Anyone") {
        collection.aggregate([
            {
              $match: {
                active: false,
                uniqueId: { $not: { $eq: uniqueId } }
              }
            }
        ]).toArray(async (err, user) => {
            if (err) {
    
                console.log("User does NOT exist or could not be found.", err);
    
                resppppp.json({
                    message: "User does NOT exist or could not be found.",
                    err
                });
            } else {
                console.log("user", user);

                if (typeof user !== "undefined" && user.length > 0) {
                    const removalProcess = await collection.deleteMany({ uniqueId: { $in: [uniqueId, user[0].uniqueId ] }});
    
                    console.log("removalProcess", removalProcess);

                    if (removalProcess) {
                        resppppp.json({
                            message: "Successfully gathered user!",
                            user
                        })
                    }
                } else {
                    resppppp.json({
                        message: "User does NOT exist or could not be found."
                    });
                }
            }
        });
    } else {
        console.log("this one :) !");
        
        collection.aggregate([
            {
              $match: {
                gender: checkedGender,
                seeking: findAuthedUser.gender,
                active: false,
                uniqueId: { $not: { $eq: uniqueId } }
              }
            }
        ]).toArray( async (err, user) => {
            if (err) {
    
                console.log("User does NOT exist or could not be found.", err);
    
                resppppp.json({
                    message: "User does NOT exist or could not be found.",
                    err
                });
            } else {
                console.log("user", user);

                if (typeof user !== "undefined" && user.length > 0) {
                    const removalProcess = await collection.deleteMany({ uniqueId: { $in: [uniqueId, user[0].uniqueId ] }});
                
                    console.log("removalProcess", removalProcess);

                    if (removalProcess) {
                        resppppp.json({
                            message: "Successfully gathered user!",
                            user
                        })
                    }
                } else {
                    resppppp.json({
                        message: "User does NOT exist or could not be found."
                    });
                }
            }
        });
    }
});

module.exports = router;