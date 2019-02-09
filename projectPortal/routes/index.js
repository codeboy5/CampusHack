const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const router = express.Router();

require('../models/users');
const User = mongoose.model('User'); 

module.exports = router;