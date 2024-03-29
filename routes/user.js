const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const createAccountLimiter = require('../middleware/rate-limit');

router.post('/signup', createAccountLimiter, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;