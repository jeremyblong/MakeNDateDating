const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.post("/", async (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const { 
        uniqueId,
        meetupID
    } = req.body;

    const authenticatedUser = await collection.findOne({ uniqueId });

    const matchingInviteIndex = authenticatedUser.meetupRequestsPending.findIndex(item => item.id === meetupID);

    const matchingResult = authenticatedUser.meetupRequestsPending[matchingInviteIndex];

    response.json({
        message: "Successfully gathered notification data!",
        result: matchingResult
    })   
});

module.exports = router;