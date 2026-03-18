const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/leaderboard.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/global',         optionalAuth, ctrl.getGlobal);
router.get('/weekly',         optionalAuth, ctrl.getWeekly);
router.get('/category/:slug', optionalAuth, ctrl.getByCategory);
router.get('/friends',        authenticate, ctrl.getFriends);

module.exports = router;
