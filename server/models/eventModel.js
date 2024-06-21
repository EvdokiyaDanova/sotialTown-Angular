const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const eventSchema = new mongoose.Schema({
    eventName: {
        type: String,
        required: true
    },
    eventDate: {
        type: Date,
        required: true
    },
    eventPlace: {
        type: String,
        required: true
    },
    eventCountry:{
        type: String,
        required: true
    },
    eventCity: {
        type: String,
        required: true
    },
    eventAddress: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true
    },
    eventStartTime: {
        type: String,
        required: true
    },
    eventDuration: {
        type: Number,
    },

    eventIsLimitedGuest: {
        type: Boolean
    },
    eventNumberOfGuests: {
        type: Number,
        required: function () { return this.isLimitedGuest === true; }
    },

    eventDescription: {
        type: String,
    },
    eventStaticPhoto: {
        type: String,
    },
    eventVideoUrl: {
        type: String, // You can use Buffer if you want to store binary data
    },
    subscribers: [{
        type: ObjectId,
        ref: "User"
    }],
    userId: {
        type: ObjectId,
        ref: "User"
    },
    posts: [{
        type: ObjectId,
        ref: "Post"
    }],
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Event', eventSchema);
