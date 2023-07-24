const { eventModel } = require('../models');
const { newPost } = require('./postController')

function getEvents(req, res, next) {
    const title = req.query.title || '';

    eventModel.find({ eventName: { $regex: title, $options: 'i' } })
        .populate('userId')
        .then(events => res.json(events))
        .catch(next);
}

function getEventsList(req, res, next) {
    const title = req.query.title || '';
    const startIndex = +req.query.startIndex || 0;
    const limit = +req.query.limit || Number.MAX_SAFE_INTEGER;

    Promise.all([
        eventModel.find({ eventName: { $regex: title, $options: 'i' } })
            .skip(startIndex)
            .limit(limit)
            .populate('userId'),
        eventModel.find({ eventName: { $regex: title, $options: 'i' } })
            .countDocuments()
    ])
        .then(([results, totalResults]) => res.json({ results, totalResults }))
        .catch(next);
}


function getEvent(req, res, next) {
    const { eventId } = req.params;

    eventModel.findById(eventId)
        .populate({
            path: 'posts',
            populate: {
                path: 'userId'
            }
        })
        .then(event => res.json(event))
        .catch(next);
}






function createEvent(req, res, next) {
    const { eventName, postText } = req.body;
    const { _id: userId } = req.user;

    eventModel.create({ eventName, userId, subscribers: [userId] })
        .then(event => {
            newPost(postText, userId, event._id)
                .then(([_, updatedEvent]) => res.status(200).json(updatedEvent))
        })
        .catch(next);
}

function subscribe(req, res, next) {
    const eventId = req.params.eventId;
    const { _id: userId } = req.user;
    eventModel.findByIdAndUpdate({ _id: eventId }, { $addToSet: { subscribers: userId } }, { new: true })
        .then(updatedEvent => {
            res.status(200).json(updatedEvent)
        })
        .catch(next);
}

function unsubscribe(req, res, next) {
    const eventId = req.params.eventId;
    const { _id: userId } = req.user;
    eventModel.findByIdAndUpdate({ _id: eventId }, { $pull: { subscribers: userId } }, { new: true })
        .then(updatedEvent => {
            res.status(200).json(updatedEvent)
        })
        .catch(next);
}


module.exports = {
    getEvents,
    getEventsList,
    createEvent,
    getEvent,
    subscribe,
    unsubscribe,
}
