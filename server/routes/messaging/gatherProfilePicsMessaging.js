const express = require("express");
const router = express.Router();
const { Connection } = require("../../mongoUtil.js");
const moment = require("moment");
const { v4: uuidv4 } = require('uuid');

router.post("/", (req, response) => {

    const collection = Connection.db.db("test").collection("users");

    const { 
        conversationList
    } = req.body;

    const conversations = [];
    
    for (let i = 0; i < conversationList.length; i++) {
        const convooooo = conversationList[i];
        conversations.push(convooooo.lastMessage.receiverId);
    }

    collection.find({ uniqueId: { $in: conversations }}).toArray((err, users) => {
        if (err) {
            console.log(err.message);

            response.json({
                err,
                message: "Could not find users, error occurred."
            })
        } else {
            const convos = [];
            
            const promiseeee = new Promise((resolve, reject) => {
                for (let index = 0; index < users.length; index++) {
                    const userrr = users[index];

                    console.log("userrr", userrr);
                    
                    for (let i = 0; i < conversationList.length; i++) {
                        const connnnnversation = conversationList[i];
                        
                        if (typeof userrr.profilePictures !== 'undefined' && userrr.profilePictures.length > 0) {
                            connnnnversation.profilePic = userrr.profilePictures[userrr.profilePictures.length - 1];
                        } else {
                            connnnnversation.profilePic = {
                                id: uuidv4(),
                                picture: "no-image-available.jpeg",
                                type: "picture",
                                date: moment(new Date()).format("dddd, MMMM Do YYYY, h:mm:ss a"),
                                systemDate: Date.now()
                            }
                        }
                        
                        convos.push(connnnnversation);
                    }
                    if ((users.length - 1) === index) {
                        resolve(convos);
                    }
                }
            })

            promiseeee.then((passedValues) => {
                response.json({
                    message: "Success!",
                    convos: passedValues
                })
            })  
        }
    })
});

module.exports = router;