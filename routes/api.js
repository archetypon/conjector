const express = require('express');
const router = express.Router();

const graphyService = require('../controllers/graphy.controller');
const userController = require('../controllers/user.controller');

/**
 * Graph management api
 */
router.post('/graph', graphyService.writeConjecture);
router.get('/graph', graphyService.findBySubject);
router.get('/graph/presets', graphyService.getPresets);

/**
 * User management api
 */
router.post('/users/auth', userController.authenticate);
router.post('/users/register', userController.register);
router.patch('/users/auth', userController.logout);

module.exports = router;
