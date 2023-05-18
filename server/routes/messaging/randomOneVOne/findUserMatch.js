const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const config = require("config");

router.post("/", async (req, response) => {

    const { signedInID } = req.body;

    const collection = Connection.db.db("test").collection("random1v1chats");

    const authedUserDoc = await collection.findOne({ uniqueId: signedInID });
    
    const matchUser = await collection.findOne({ gender: authedUserDoc.seeking });

    response.json({
        message: "Successfully matched!"
    })
});

module.exports = router;