const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/tournament.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');

router.get('/',                    optionalAuth, ctrl.getAll);
router.get('/current',             optionalAuth, ctrl.getCurrent);
router.get('/:id',                 optionalAuth, ctrl.getById);
router.post('/:id/join',           authenticate, ctrl.join);
router.get('/:id/scoreboard',      optionalAuth, ctrl.getScoreboard);
router.post('/:id/submit',         authenticate, ctrl.submit);

module.exports = router;
