const express = require('express');
const profileRouter = express.Router();
const logger = require('../utils/logger');
const routeUtils = require('../utils/route_utils');
const { PAGES, ROUTES, URLS_REDIRECT } = require('../utils/constants');
const {
  userUpdate,
  getUser,
  updateUserPassword,
} = require('../client/users.api');

profileRouter.get(ROUTES.PROFILE, async (req, res) => {
  res.render(PAGES.PROFILE);
});

profileRouter.post(ROUTES.PROFILE, async (req, res) => {
  const { firstName, lastName, email, phoneNumber, profileImage } = req.body;

  const id = res.locals.user.id;
  try {
    const updateUserData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
    };

    if (!phoneNumber) {
      updateUserData.phoneNumber = 'NA';
    }

    if (profileImage) {
      updateUserData.profileImage = profileImage;
    }

    const response = await userUpdate(id, updateUserData);

    if (response.status === 200) {
      // retrieve updated user data and update session
      const updateUserResponse = await getUser(id);
      req.session.user = updateUserResponse.data;
      res.redirect(URLS_REDIRECT.PROFILE);
    } else {
      logger.error(`Error encountered updating profile`, error);
      routeUtils.handleErrorMessageRedirect(
        res,
        response.data.message,
        URLS_REDIRECT.PROFILE,
      );
    }
  } catch (error) {
    logger.error(`Error encountered profileRouter post /profile`, error);
    routeUtils.handleErrorMessageRedirect(
      res,
      'Error occurred while updating user profile. Please try again.',
      URLS_REDIRECT.PROFILE,
    );
  }
});

profileRouter.post(`${ROUTES.PROFILE}/password`, async (req, res) => {
  const { currentPassword, newPassword, reenterNewPassword } = req.body;

  const id = res.locals.user.id;
  try {
    const updatePasswordData = {
      currentPassword: currentPassword,
      newPassword: newPassword,
      reEnterNewPassword: reenterNewPassword,
    };

    const response = await updateUserPassword(id, updatePasswordData);

    if (response.status === 200) {
      logger.error(`Successfully updated user password.`);
      res.redirect(URLS_REDIRECT.PROFILE);
    } else {
      logger.error(`Error encountered udpating user password`, response.data);
      res.redirect(URLS_REDIRECT.PROFILE);
    }
  } catch (error) {
    logger.error(
      `Error encountered profileRouter post /profile/password`,
      error,
    );
    routeUtils.handleErrorMessageRedirect(
      res,
      error.response.data.message,
      URLS_REDIRECT.PROFILE,
    );
  }
});

module.exports = profileRouter;
