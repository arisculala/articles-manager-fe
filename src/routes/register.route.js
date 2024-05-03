const express = require('express');
const registerRouter = express.Router();
const logger = require('../utils/logger');
const { PAGES, ROUTES, URLS_REDIRECT } = require('../utils/constants');
const { userRegister } = require('../client/users.api');

registerRouter.get(ROUTES.REGISTER, async (req, res) => {
  res.render(PAGES.REGISTER);
});

registerRouter.post(ROUTES.REGISTER, async (req, res) => {
  const { firstName, lastName, email, phoneNumber, profileImage, password } =
    req.body;

  try {
    const registerUserData = {
      firstName,
      lastName,
      email,
      phoneNumber: phoneNumber || 'NA',
      password,
      is2FAEnable: false,
    };

    if (profileImage) {
      registerUserData.profileImage = profileImage;
    }

    const response = await userRegister(registerUserData);

    if (response.status === 201) {
      req.session.user = response.data;
      res.redirect(URLS_REDIRECT.HOME);
    } else {
      req.session.errorMessage = response.data.message;
      res.render(PAGES.REGISTER);
    }
  } catch (error) {
    logger.error(`Error encountered registerRouter post /register`, error);
    req.session.errorMessage =
      'Error occurred while registering your account. Please try again.';
    res.render(PAGES.REGISTER);
  }
});

module.exports = registerRouter;
