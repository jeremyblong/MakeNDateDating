const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewScratcherWinnerLoser = new Schema({
    id: {
        type: String
    },
    userID: {
        type: String
    },
    date: {
        type: Date
    },
    firstName: {
        type: String
    },
    username: {
        type: String
    },
    createdAt: { type: Date, expires: '24h', default: Date.now, index: true }
});

NewScratcherWinnerLoser.index({ createdAt: 1 }, { expireAfterSeconds: '24h' });

module.exports = NewScratch = mongoose.model("lotteryscratcher", NewScratcherWinnerLoser);