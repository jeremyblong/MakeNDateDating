const express = require("express");
const router = express.Router();
const { Connection } = require("../../../mongoUtil.js");

router.get("/", (req, resppppp) => {

    const { postedByID } = req.query;

    const collection = Connection.db.db("test").collection("users");

    const trackingNumber = req.body.data.tracking_number;
    const statusCode = req.body.data.status_code;

    if(statusCode === 'DE') { // Package was delivered
        resppppp.json({
            message: "Successfully recieved webhook data!"
        })
    }
});

module.exports = router;