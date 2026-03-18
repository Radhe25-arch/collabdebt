// ─── BATTLE ROUTES ────────────────────────────────────────
const express = require('express');
const battleRouter    = express.Router();
const questRouter     = express.Router();
const portfolioRouter = express.Router();

const battleCtrl    = require('../controllers/battle.controller');
const questCtrl     = require('../controllers/quest.controller');
const portfolioCtrl = require('../controllers/portfolio.controller');
const { authenticate } = require('../middleware/auth');

// All battle routes require auth
battleRouter.use(authenticate);
battleRouter.post('/',                battleCtrl.challenge);
battleRouter.get('/',                 battleCtrl.getMyBattles);
battleRouter.get('/:id',              battleCtrl.getBattle);
battleRouter.post('/:id/respond',     battleCtrl.respond);
battleRouter.post('/:id/configure',   battleCtrl.configure);
battleRouter.post('/:id/submit',      battleCtrl.submit);
battleRouter.post('/:id/complete',    battleCtrl.forceComplete);

// Quest routes
questRouter.use(authenticate);
questRouter.get('/',                  questCtrl.getTodayQuests);
questRouter.post('/progress',         questCtrl.updateProgress);
questRouter.get('/history',           questCtrl.getHistory);

// Portfolio routes
portfolioRouter.get('/me',                        authenticate, portfolioCtrl.getPortfolio);
portfolioRouter.put('/me',                        authenticate, portfolioCtrl.upsertPortfolio);
portfolioRouter.get('/me/readme',                 authenticate, portfolioCtrl.generateReadme);
portfolioRouter.post('/me/push-github',           authenticate, portfolioCtrl.pushToGithub);
portfolioRouter.post('/me/projects',              authenticate, portfolioCtrl.addProject);
portfolioRouter.delete('/me/projects/:projectId',     authenticate, portfolioCtrl.deleteProject);
portfolioRouter.get('/user/:userId',              portfolioCtrl.getPortfolio);

module.exports = { battleRouter, questRouter, portfolioRouter };
