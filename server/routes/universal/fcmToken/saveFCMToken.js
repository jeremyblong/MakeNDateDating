const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.post("/", async (req, resppppp) => {

    const { fcmToken, uniqueId } = req.body;

    console.log("fcmToken", fcmToken);

    const collection = Connection.db.db("test").collection("users");
    const mentorCollection = Connection.db.db("test").collection("mentors");

    const firstCheckMatch = await collection.findOne({ uniqueId });

    if (typeof firstCheckMatch !== "undefined" && firstCheckMatch !== null) {
        collection.findOneAndUpdate({ uniqueId }, { $set: { fcmToken }}, { returnDocument: 'after' }, (errrrrr, doccccc) => {
            if (errrrrr) {
                console.log("errrrrr in request...:", errrrrr);
    
                resppppp.json({
                    message: "Failed to update other user's notification results - undo changes...",
                    err: errrrrr
                });
            } else {
                console.log("docccccccc", doccccc);
    
                resppppp.json({
                    message: "Registered FCM token!"
                })
            }
        })  
    } else {
        const secondCheckMatch = await mentorCollection.findOne({ uniqueId });

        mentorCollection.findOneAndUpdate({ uniqueId }, { $set: { fcmToken }}, { returnDocument: 'after' }, (errrrrr, doccccc) => {
            if (errrrrr) {
                console.log("errrrrr in request...:", errrrrr);
    
                resppppp.json({
                    message: "Failed to update other user's notification results - undo changes...",
                    err: errrrrr
                });
            } else {
                console.log("docccccccc", doccccc);
    
                resppppp.json({
                    message: "Registered FCM token!"
                })
            }
        })  
    }
});

module.exports = router;