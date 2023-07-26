const { eventModel, userModel, postModel } = require('../models');
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
  const currPage = req.query.currPage;
  
    const userId = req.query.userId;

    let query = eventModel.find({ eventName: { $regex: title, $options: 'i' } });

    if (currPage=="favorite") {
        query.where('subscribers').equals(userId);
    } else if (currPage=="myevents") {
        query.where('userId').equals(userId);
    }

    // create query for caunt events
    const countQuery = eventModel.find({ eventName: { $regex: title, $options: 'i' } });
    if (currPage=="favorite") {
        countQuery.where('subscribers').equals(userId);
    } else if (currPage=="myevents") {
        countQuery.where('userId').equals(userId);
    }

    // get caunt and events
    Promise.all([
        query.skip(startIndex)
            .limit(limit)
            .populate('userId')
            .exec(),
        countQuery.countDocuments().exec() 
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
    const { eventName } = req.body;
    const { _id: userId } = req.user;

    eventModel.create({ eventName, userId, subscribers: [userId] })
    .then(event => res.json(event))
        // .then(event => {
        //     newPost(postText, userId, event._id)
        //         .then(([_, updatedEvent]) => res.status(200).json(updatedEvent))
        // })
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



function editEvent(req, res, next) {
    const { eventId } = req.params;
    const { eventName } = req.body;
    const { _id: userId } = req.user;

    // if the userId is not the same as this one of the event, the post will not be updated
    eventModel.findOneAndUpdate({ _id: eventId, userId }, { eventName: eventName }, { new: true })
        .then(updatedEvent => {
            if (updatedEvent) {
                res.status(200).json(updatedEvent);
            }
            else {
                res.status(401).json({ message: `Not allowed!` });
            }
        })
        .catch(next);
}




// function deleteEvent(req, res, next) {
//     const { eventId } = req.params;
//     const { _id: userId } = req.user;

//     Promise.all([
//         eventModel.findOneAndDelete({ _id: eventId, userId }),
//       //  userModel.findOneAndUpdate({ _id: userId }, { $pull: { events: eventId } }),
//       userModel.updateMany({ 'posts.eventId': eventId }, { $pull: { 'posts.$[].eventId': eventId } }),
//         userModel.updateMany({ events: eventId }, { $pullAll: { events: [eventId] } }),
//         postModel.deleteMany({ eventId }) // delete all post connected with eventId
//     ])
//         .then(([deletedEvent, updatedUserPosts, updatedUserEvents, deletedPosts]) => {
//             if (deletedEvent) {
//                 res.status(200).json(deletedEvent);
//             } else {
//                 res.status(401).json({ message: `Not allowed!` });
//             }
//         })
//         .catch(next);
// }
function deleteEvent(req, res, next) {
    const { eventId } = req.params;
    const { _id: userId } = req.user;

    eventModel.findByIdAndDelete(eventId)
        .then(deletedEvent => {
            if (!deletedEvent) {
                return res.status(401).json({ message: `Not allowed!` });
            }

            return userModel.updateMany(
                { 'posts': { $in: deletedEvent.posts } }, 
                { $pull: { 'posts': { $in: deletedEvent.posts } } }
            );
        })
        .then(updatedUsers => {
            return userModel.updateMany(
                { 'events': eventId }, 
                { $pull: { 'events': eventId } }
            );
        })
        .then(updatedUsers => {
            return postModel.deleteMany({ eventId });
        })
        .then(deletedPosts => {
            res.status(200).json({ message: 'Event and related posts deleted successfully' });
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
    editEvent,
    deleteEvent,
}
