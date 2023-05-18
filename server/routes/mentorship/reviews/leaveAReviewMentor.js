const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../mongoUtil.js");

router.post("/", (req, resppppp) => {

    const { 
        description, 
        title,
        review,
        uniqueId,
        reviewerUsername,
        reviewerName,
        mentorID
    } = req.body;

    const newReview = {
        description, 
        title,
        rating: review,
        reviewerID: uniqueId,
        reviewerUsername,
        reviewerName,
        dateReviewed: new Date()
    };

    const collection = Connection.db.db("test").collection("mentors");
    const usersCollection = Connection.db.db("test").collection("users");

    collection.findOneAndUpdate({ uniqueId: mentorID }, { $push: { reviewsOfMentor: newReview } }, { returnDocument: 'after' },  (err, data) => {
        if (err) {
            console.log(err.message);

            resppppp.json({
                message: "An error occurred while attempting to update DB information...",
                err
            })
        } else {
            console.log("result", data);

            usersCollection.findOneAndUpdate({ uniqueId }, { $inc: { rank: 35 } }, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
        
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
        
                    resppppp.json({
                        message: "Successfully left review!",
                        data: data.value
                    })
                }
            })
        }
    })
});

module.exports = router;