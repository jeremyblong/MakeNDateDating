const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const moment = require("moment");
const NewGroupSchema = require("../../../schemas/meetups/registerNewMeetup.js");

router.post("/", (req, resppppp) => {
    console.log("req.body", req.body);

    const { 
        selectedMeetupLocation, 
        locationMeetupDetails, 
        meetupTime, 
        groupTitle, 
        description, 
        memberCount, 
        selectedAddress, 
        selectedTags, 
        images,
        fullName, 
        uniqueId,
        repeatingDateTime,
        username
    } = req.body;

    const latitude = selectedMeetupLocation.latitude;
    const longitude = selectedMeetupLocation.longitude;

    if (!repeatingDateTime) {
        // do NOT repeat...
    
        const saveNewMeetup = new NewGroupSchema({
            selectedMeetupLocation, 
            locationMeetupDetails, 
            geoJsonLoc: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            meetupTime, 
            title: groupTitle, 
            description, 
            maximumMemberCount: memberCount, 
            generalRegionOfMeetup: selectedAddress, 
            relevantTagsMeetup: selectedTags, 
            meetupPics: images,
            postedBy: uniqueId,
            repeating: repeatingDateTime,
            datesOfOccurance: [],
            members: [],
            postedByName: fullName,
            postedByUsername: username,
            id: uuidv4(),
            posted: new Date(),
            postedString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
            comments: [],
            reviewsOfGroup: []
        })
    
        saveNewMeetup.save((err, result) => {
            if (err) {
                console.log("err", err);
    
                resppppp.json({
                    message: "Error occurred while attempting to post your meetup!",
                    err
                })
            } else {
                console.log("result", result);
    
                resppppp.json({
                    message: "Successfully posted new meetup!",
                    data: result
                })
            }
        })
    } else {
        let date;
        const datesOfOccurance = [];
        // iterate and repeat!
        for (let idx = 0; idx < 8; idx++) {
            switch (idx) {
                case 0:
                    datesOfOccurance.push({
                        raw: new Date(moment(date, "DD-MM-YYYY").add(1, 'w')),
                        formatted: moment(date, "DD-MM-YYYY").add(1, 'w')
                    });
                    break;
                case 1:
                    datesOfOccurance.push({
                        raw: new Date(moment(date, "DD-MM-YYYY").add(2, 'w')),
                        formatted: moment(date, "DD-MM-YYYY").add(2, 'w')
                    });
                    break;
                case 2:
                    datesOfOccurance.push({
                        raw: new Date(moment(date, "DD-MM-YYYY").add(3, 'w')),
                        formatted: moment(date, "DD-MM-YYYY").add(3, 'w')
                    });
                    break;
                case 3:
                    datesOfOccurance.push({
                        raw: new Date(moment(date, "DD-MM-YYYY").add(4, 'w')),
                        formatted: moment(date, "DD-MM-YYYY").add(4, 'w')
                    });
                    break;
                case 4:
                    datesOfOccurance.push({
                        raw: new Date(moment(date, "DD-MM-YYYY").add(5, 'w')),
                        formatted: moment(date, "DD-MM-YYYY").add(5, 'w')
                    });
                    break;
                case 5:
                    datesOfOccurance.push({
                        raw: new Date(moment(date, "DD-MM-YYYY").add(6, 'w')),
                        formatted: moment(date, "DD-MM-YYYY").add(6, 'w')
                    });
                    break;
                case 6:
                    datesOfOccurance.push({
                        raw: new Date(moment(date, "DD-MM-YYYY").add(7, 'w')),
                        formatted: moment(date, "DD-MM-YYYY").add(7, 'w')
                    });
                    break;
                case 7:
                    datesOfOccurance.push({
                        raw: new Date(moment(date, "DD-MM-YYYY").add(8, 'w')),
                        formatted: moment(date, "DD-MM-YYYY").add(8, 'w')
                    });
                    break;
                default:
                    break;
            }
        }

        const saveNewMeetup = new NewGroupSchema({
            selectedMeetupLocation, 
            locationMeetupDetails, 
            meetupTime, 
            geoJsonLoc: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            title: groupTitle, 
            description, 
            maximumMemberCount: memberCount, 
            generalRegionOfMeetup: selectedAddress, 
            relevantTagsMeetup: selectedTags, 
            meetupPics: images,
            postedBy: uniqueId,
            repeating: repeatingDateTime,
            postedByUsername: username,
            datesOfOccurance,
            members: [],
            postedByName: fullName,
            id: uuidv4(),
            posted: new Date(),
            postedString: moment(new Date()).format("MM/DD/YYYY hh:mm:ss a"),
            comments: [],
            reviewsOfGroup: []
        })
    
        saveNewMeetup.save((err, result) => {
            if (err) {
                console.log("err", err);
    
                resppppp.json({
                    message: "Error occurred while attempting to post your meetup!",
                    err
                })
            } else {
                console.log("result", result);
    
                resppppp.json({
                    message: "Successfully posted new meetup!",
                    data: result
                })
            }
        })
    }
});

module.exports = router;