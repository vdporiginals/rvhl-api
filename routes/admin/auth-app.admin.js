const express = require('express');

const { authApp } = require('../../controllers/auth.controller');

const router = express.Router();

router.get('/auth-app', authApp);

module.exports = router;
