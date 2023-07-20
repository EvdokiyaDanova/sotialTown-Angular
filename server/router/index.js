const router = require('express').Router();
const users = require('./users');
const events = require('./events');
const posts = require('./posts');
const likes = require('./likes');
const dislikes = require('./dislikes');
const unlike = require('./unlike');
const removeunlike = require('./removeunlike');
const test = require('./test');
const { authController } = require('../controllers');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

router.use('/users', users);
router.use('/events', events);
router.use('/posts', posts);
router.use('/likes', likes);
router.use('/dislikes', dislikes);
router.use('/unlike', unlike);
router.use('/removeunlike', removeunlike);
router.use('/test', test);

module.exports = router;
