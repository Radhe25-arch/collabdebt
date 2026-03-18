const express      = require('express');
const mentorRouter = express.Router();
const roomRouter   = express.Router();

const mentorCtrl   = require('../controllers/mentor.controller');
const roomCtrl     = require('../controllers/room.controller');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Mentor routes — all protected
mentorRouter.use(authenticate);
mentorRouter.get('/',                    mentorCtrl.getSession);
mentorRouter.post('/sessions',           mentorCtrl.createSession);
mentorRouter.post('/sessions/:sessionId/message', (req, res, next) => {
  req.body.sessionId = req.params.sessionId;
  mentorCtrl.sendMessage(req, res, next);
});
mentorRouter.delete('/sessions/:id',     mentorCtrl.deleteSession);

// Code Room routes
roomRouter.get('/',          optionalAuth,  roomCtrl.getPublicRooms);
roomRouter.post('/',         authenticate,  roomCtrl.createRoom);
roomRouter.get('/:id',       optionalAuth,  roomCtrl.getRoom);
roomRouter.post('/:id/join', authenticate,  roomCtrl.joinRoom);
roomRouter.put('/:id/code',  authenticate,  roomCtrl.updateCode);
roomRouter.delete('/:id/leave', authenticate, roomCtrl.leaveRoom);

module.exports = { mentorRouter, roomRouter };
