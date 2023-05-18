const express = require("express");
const router = express.Router();
const { Connection } = require("../../mongoUtil.js");
const config = require("config");
const axios = require("axios");
const calculatedStringResp = require("./reportTemplate.js");

router.post("/", async (req, resppppp) => {
    // deconstruct values passed...
    const { passedType, authedUniqueId, accountType, otherUserID } = req.body;
    // structure collections
    const userCollection = Connection.db.db("test").collection("users");
    const mentorCollection = Connection.db.db("test").collection("mentors");
    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");
    // find results collection based
    const matchingOtherUser = await userCollection.findOne({ uniqueId: otherUserID });
    const authedUserFullDetails = await collection.findOne({ uniqueId: authedUniqueId });
    // "urgent", "high", "medium", "low"
    const calculatePriority = () => {
        switch (passedType) {
            case 'Report Racism, Sexism Or Other Extremism':
                return 4;
                break;
            case 'Report dangerous situation/user':
                return 3;
                break;
            case "Unmatch & report general behavior":
                return 1;
                break;
            case "Report physical safety concerns":
                return 4;
                break;
            case "Report bullying/harassment":
                return 2;
                break;
            default:
                break;
        }
    }

    if (matchingOtherUser !== null) {
        
        const response = await axios.post('https://makendate.freshdesk.com/api/v2/tickets', {
            'subject': passedType,
            "priority": calculatePriority(passedType),
            // "attachments": [],
            "status": 2,
            "description": calculatedStringResp(passedType, matchingOtherUser, authedUserFullDetails),
            "requester_id": Number(matchingOtherUser._id),
            "email": matchingOtherUser.email
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            auth: {
                username: config.get("freshdeskAPIKey"),
                password: 'X'
            }
        });

        if (response.status === 201 || response.status === 200) {
            console.log("response.data", response.status);

            resppppp.json({
                message: "Submitted request!"
            })
        } else {
            resppppp.json({
                message: "An error occurred while processing the request!"
            })
        }
    } else {
        const matchingOtherUserMentor = await mentorCollection.findOne({ uniqueId: otherUserID });

        const response = await axios.post('https://makendate.freshdesk.com/api/v2/tickets', {
            'subject': passedType,
            "priority": calculatePriority(passedType),
            // "attachments": [],
            "status": 2,
            "description": calculatedStringResp(passedType, matchingOtherUserMentor, authedUserFullDetails),
            "requester_id": Number(matchingOtherUserMentor._id),
            "email": matchingOtherUserMentor.email
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            auth: {
                username: config.get("freshdeskAPIKey"),
                password: 'X'
            }
        });


        if (response.status === 201 || response.status === 200) {
            console.log("response.data", response.status);

            resppppp.json({
                message: "Submitted request!"
            })
        } else {
            resppppp.json({
                message: "An error occurred while processing the request!"
            })
        }
    }
});

module.exports = router;