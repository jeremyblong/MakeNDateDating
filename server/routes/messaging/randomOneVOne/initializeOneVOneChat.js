const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const NewRandomChat1v1Schema = require("../../../schemas/messaging/oneVOneRandomChatSchema.js");

router.post("/", async (req, response) => {

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

    // const { ageBegin, ageEnd } = ages;

    const alreadyParticpating = await collection.findOne({ uniqueId });

    if (alreadyParticpating !== null) {
        response.json({
            message: "Successfully added to queue!"
        })
    } else {
        const newSave = new NewRandomChat1v1Schema({
            uniqueId,
            firstName,
            username,
            // ageBegin, 
            // ageEnd, 
            seeking: checkedGender,
            gender,
            active: false,
            birthdate
        });
    
        newSave.save((error, result) => {
            if (error) {
                console.log("error", error);
    
                response.json({
                    message: "An error occurred while attempting to save data...",
                    err: error
                });
    
            } else {
                console.log("result", result);
    
                response.json({
                    message: "Successfully added to queue!",
                    data: result
                })
            }
        })
    }
});

module.exports = router;