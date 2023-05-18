const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NewGameCompeteSchema = new Schema({
    id: {
        type: String
    },
    creationDate: {
        type: Date
    },
    creationDateString: {
        type: String
    },
    comments: {
        type: Array
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    },
    alreadyReacted: {
        type: Array
    },
    postedName: {
        type: String
    },
    posterUsername: {
        type: String
    },
    postedByID: {
        type: String
    },
    listingData: {
        type: Object
    },
    page: {
        type: String
    },
    posterGender: {
        type: String
    },
    bachelor: {
        type: Object
    },
    joined: {
        type: Array
    },
    joinable: {
        type: Boolean
    }
});

module.exports = NewCompetitionGame = mongoose.model("bachelorettegame", NewGameCompeteSchema);