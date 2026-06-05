const express = require('express');
const AuthController = require('../controllers/auth.controller');
const { validate } = require('../middlewares/validation.middleware');

const router = express.Router();

router.post('/register', validate({ username: 'string', password: 'string' }), AuthController.register);
router.post('/login', validate({ username: 'string', password: 'string' }), AuthController.login);

module.exports = router;
