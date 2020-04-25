const express = require('express');

const { authApp } = require('../../controllers/auth.controller');
const User = require('../../models/user.model');

const router = express.Router();

const { protect } = require('../../middleware/auth');

router.get('/auth-app', authApp);

module.exports = router;
