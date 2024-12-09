const express = require('express');
const { loginUser, registerUser, googleLogin } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', registerUser);

router.post('/login', loginUser);

router.post('/google', googleLogin);

module.exports = router;
