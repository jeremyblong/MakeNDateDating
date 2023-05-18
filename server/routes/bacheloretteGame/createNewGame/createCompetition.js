const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const { Connection } = require("../../../mongoUtil.js");
const _ = require('lodash');
const NewCompetitionGame = require("../../../schemas/competition/newGame.js");

router.post("/", async (req, resppppp, next) => {

    const { uniqueId, accountType, formData } = req.body;

    const {
        title,
        subtitle,
        prescreeningOne,
        desiredGoal,
        prescreeningTwo,
        canidateCount,
        relationshipType,
        rewardCountTokens,
        startDate,
        endDate
    } = formData;

	const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    const gatheredUser = await collection.findOne({ uniqueId });
    
    const calculateBizzType = (type) => {
        switch (type) {
          case "bizz":
            return "Bizz (business relationship's)";
            break;
          case "date":
            return "Date (Looking for a partner)";
            break;
          case "bff":
            return "Bff (Looking for friend's)";
            break;
          case "mentorship/companionship":
            return "Mentor/Counselor";
            break;
          default: 
            return "Unknown.."
            break;
        }
    };

    const fields = [
        "coverPhoto", 
        "subscriptionAmountRestrictedContent", 
        "firstName", 
        "username", 
        "email", 
        "profilePictures", 
        "uniqueId", 
        "verificationCompleted", 
        "registrationDate", 
        "registrationDateString", 
        "reviews", 
        "totalUniqueViews", 
        "rank", 
        "stripeAccountVerified", 
        "currentApproxLocation", 
        "coreProfileData", 
        "gender", 
        "interestedIn", 
        "restrictedImagesVideos", 
        "birthdateRaw", 
        "accountType",
        "subscribedUsersRestricted",
        "requestedMatches"
    ];

    if (gatheredUser !== null) {
        if (gatheredUser.inAppTokenCurrency >= Math.floor(rewardCountTokens * 0.50)) {
            const NewSave = new NewCompetitionGame({
                id: uuidv4(),
                creationDate: new Date(),
                creationDateString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
                comments: [],
                likes: 0,
                dislikes: 0,
                alreadyReacted: [],
                postedName: `${gatheredUser.firstName} ${gatheredUser.lastName.charAt(0)}`, 
                posterUsername: gatheredUser.username,
                posterGender: calculateBizzType(gatheredUser.accountType),
                bachelor: _.pick(gatheredUser, fields),
                postedByID: uniqueId,
                joined: [],
                joinable: true,
                page: 1,
                listingData: {
                    title,
                    subtitle,
                    prescreeningOne,
                    desiredGoal,
                    prescreeningTwo,
                    canidateCount,
                    relationshipType,
                    rewardCountTokens,
                    startDate,
                    endDate
                }
            });
        
            NewSave.save((err, result) => {
                if (err) {
                    console.log("err", err);
        
                    resppppp.json({
                        message: "Problem occurred while processing your request...",
                        err
                    })
                } else {
                    console.log("result", result);
        
                    resppppp.json({
                        message: "Successfully initialized game!"
                    })
                }
            });
        } else {
            resppppp.json({
                message: "You do NOT have enough tokens to purchase this item!"
            })
        }
    } else {
        resppppp.json({
            message: "Problem occurred while processing your request...",
            err: null
        })
    }
});

module.exports = router;