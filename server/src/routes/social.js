const express = require('express');
const router = express.Router();
const socialController = require('../controllers/social.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect); // All social routes require authentication

router.get('/community',          socialController.getCommunityUsers);
router.post('/friend-request/:id', socialController.sendFriendRequest);
router.post('/friend-accept/:id',  socialController.acceptFriendRequest);
router.get('/friends',            socialController.getFriends);
router.get('/friend-requests',    socialController.getPendingRequests);

module.exports = router;
