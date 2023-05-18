const express = require("express");
const router = express.Router();
const { Connection } = require("../../mongoUtil.js");

router.get("/", async (req, resppppp) => {

    const { requestedBy } = req.query;

    console.log("req.query", req.query);

    const collection = Connection.db.db("test").collection("users");

    const mentorshipCollection = Connection.db.db("test").collection("mentors");

    const match = await collection.findOne({ uniqueId: requestedBy });

    if (match !== null) {
        const filteredQueryFields = { projection: { profilePictures: 1, uniqueId: 1, reviewsOfMentor: 1, firstName: 1, username: 1 }};

        collection.findOne({ uniqueId: requestedBy }, filteredQueryFields).then((user) => {
            if (!user) {
    
                console.log("User does NOT exist or could not be found.");
    
                resppppp.json({
                    message: "User does NOT exist or could not be found."
                });
            } else {
                console.log("fetched...", user);
    
                resppppp.json({
                    message: "Successfully fetched!",
                    user
                })
            }
        }).catch((err) => {
            console.log(err.message);
    
            resppppp.json({
                message: "Unknown error.",
                err
            })
        })
    } else {
        const secondMatchCheck = await mentorshipCollection.findOne({ uniqueId: requestedBy });

        const filteredQueryFields = { projection: { profilePictures: 1, uniqueId: 1, reviewsOfMentor: 1, firstName: 1, username: 1 }};

        mentorshipCollection.findOne({ uniqueId: requestedBy }, filteredQueryFields).then((user) => {
            if (!user) {
    
                console.log("User does NOT exist or could not be found.");
    
                resppppp.json({
                    message: "User does NOT exist or could not be found."
                });
            } else {
                console.log("fetched...", user);
    
                resppppp.json({
                    message: "Successfully fetched!",
                    user
                })
            }
        }).catch((err) => {
            console.log(err.message);
    
            resppppp.json({
                message: "Unknown error.",
                err
            })
        })
    }
});

module.exports = router;