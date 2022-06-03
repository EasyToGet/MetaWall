const jwt = require('jsonwebtoken');
const appError = require('./appError');
const handleErrorAsync = require('./handleErrorAsync');
const express = require('express');
const User = require('../models/userModel');

const isAuth = handleErrorAsync(async (req, res, next) => {

});

const generateSendJWT = (user, statusCode, res) => {
  // 產生 JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRES_DAY
  });
  user.password = undefined;
  res.status(statusCode).send({
    status: 'success',
    user: {
      token,
      name: user.name
    }
  });
};

module.exports = {
  isAuth,
  generateSendJWT
}