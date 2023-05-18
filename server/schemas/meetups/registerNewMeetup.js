const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const NewGroupSchema = new Schema({
    selectedMeetupLocation: {
        type: Object
    }, 
    locationMeetupDetails: {
        type: Object
    },
    meetupTime: {
        type: Date
    }, 
    title: {
        type: String
    },
    description: {
        type: String
    },
    geoJsonLoc: {
        type: Object
    },
    members: {
        type: Array
    },
    maximumMemberCount: {
        type: Number
    }, 
    generalRegionOfMeetup: {
        type: Object
    },
    relevantTagsMeetup: {
        type: Array
    }, 
    repeating: {
        type: Boolean
    },
    datesOfOccurance: {
        type: Array
    },
    meetupPics: {
        type: Object
    },
    postedBy: {
        type: String
    },
    postedByName: {
        type: String
    },
    id: {
        type: String
    },
    posted: {
        type: Date
    },
    postedString: {
        type: String
    },
    postedByUsername: {
        type: String
    },
    comments: {
        type: Array
    },
    reviewsOfGroup: {
        type: Array
    }
});

module.exports = NewGroup = mongoose.model("meetup", NewGroupSchema);