const express = require('express');
const router = express.Router();
const { auth } = require('../utils');
const { eventController, postController } = require('../controllers');

// middleware that is specific to this router

router.get('/', eventController.getEvents);
router.get('/list', eventController.getEventsList);
router.post('/', auth(), eventController.createEvent);

router.get('/:eventId', eventController.getEvent);
router.post('/:eventId', auth(), postController.createPost);
router.put('/:eventId', auth(), eventController.subscribe);
router.post('/:eventId/edit', auth(), eventController.editEvent);
router.delete('/:eventId/delete', auth(), eventController.deleteEvent);
router.put('/:eventId/unsubscribe', auth(), eventController.unsubscribe);
router.put('/:eventId/posts/:postId', auth(), postController.editPost);
router.delete('/:eventId/posts/:postId', auth(), postController.deletePost);

// router.get('/my-trips/:id/reservations', auth(), eventController.getReservations);

module.exports = router