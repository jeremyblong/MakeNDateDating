const express = require("express");
const router = express.Router();
const config = require("config");
const { Connection } = require("../../../../mongoUtil.js");

router.post("/", (req, resppppp) => {

    const { 
        uniqueId,
        selectedValue,
        field,
        accountType
    } = req.body;
    
    const collection = Connection.db.db("test").collection((accountType === "bizz") || (accountType === "date") || (accountType === "bff") ? "users" : "mentors");

    switch (field) {
        case "heightProfileData":
            collection.findOneAndUpdate({ uniqueId }, { $set: { "coreProfileData.heightProfileData": selectedValue } }, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
        
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
        
                    resppppp.json({
                        message: "Successfully executed desired logic!",
                        data: data.value
                    })
                }
            })
            break;
        case "occupationalSettings": 

            const { description, selected } = selectedValue;

            const employmentData = {
                description, 
                sector: selected
            };
            collection.findOneAndUpdate({ uniqueId }, { $set: { "coreProfileData.employmentData": employmentData } }, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
        
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
        
                    resppppp.json({
                        message: "Successfully executed desired logic!",
                        data: data.value
                    })
                }
            })
            break;
        case "educationalSettings":

            const { 
                startedYear, 
                endingYear, 
                locationState, 
                degreeAquired, 
                schoolName 
            } = selectedValue;

            const additionEducation = {
                startedYear, 
                endingYear, 
                locationState, 
                degreeAquired, 
                schoolName 
            }
            collection.findOneAndUpdate({ uniqueId }, { $set: { "coreProfileData.educationalData": additionEducation } }, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
        
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
        
                    resppppp.json({
                        message: "Successfully executed desired logic!",
                        data: data.value
                    })
                }
            })
            break;
        case "biographyAndInterests":

            const { 
                aboutMeBio,
                selectedOptions
            } = selectedValue;

            collection.findOneAndUpdate({ uniqueId }, { $set: { "coreProfileData.aboutMe": aboutMeBio, "coreProfileData.interests": selectedOptions } }, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
        
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
        
                    resppppp.json({
                        message: "Successfully executed desired logic!",
                        data: data.value
                    })
                }
            })
            break;
        case "profilePromptData":

            const { 
                completedPrompts
            } = selectedValue;

            collection.findOneAndUpdate({ uniqueId }, { $set: { "coreProfileData.aboutPrompts": completedPrompts } }, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
        
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
        
                    resppppp.json({
                        message: "Successfully executed desired logic!",
                        data: data.value
                    })
                }
            })
            break;
        case "hairColor":
            collection.findOneAndUpdate({ uniqueId }, { $set: { "coreProfileData.hairColor": selectedValue.value } }, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
        
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
        
                    resppppp.json({
                        message: "Successfully executed desired logic!",
                        data: data.value
                    })
                }
            })
            break;
        case "numberOfChildren": 
            collection.findOneAndUpdate({ uniqueId }, { $set: { "coreProfileData.custodyChildren": selectedValue } }, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
        
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
        
                    resppppp.json({
                        message: "Successfully executed desired logic!",
                        data: data.value
                    })
                }
            })
            break;
        case "religion": 
            collection.findOneAndUpdate({ uniqueId }, { $set: { "coreProfileData.religion": selectedValue } }, { returnDocument: 'after' },  (err, data) => {
                if (err) {
                    console.log(err.message);
        
                    resppppp.json({
                        message: "An error occurred while attempting to update DB information...",
                        err
                    })
                } else {
                    console.log("result", data);
        
                    resppppp.json({
                        message: "Successfully executed desired logic!",
                        data: data.value
                    })
                }
            })
            break;
        default:
            break;
    }
});

module.exports = router;