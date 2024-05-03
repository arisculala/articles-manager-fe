const express = require('express');
const loginRouter = express.Router();
const logger = require('../utils/logger');
const { PAGES, ROUTES, URLS_REDIRECT } = require('../utils/constants');
const { userLogin } = require('../client/users.api');

loginRouter.get(ROUTES.LOGIN, async (req, res) => {
  res.render(PAGES.LOGIN);
});

loginRouter.post(ROUTES.LOGIN, async (req, res) => {
  try {
    const { email, password } = req.body;
    const response = await userLogin(email, password);
    if (response.status === 200) {
      req.session.user = response.data; // store the user details in session
      res.redirect(URLS_REDIRECT.HOME);
    } else {
      res.render(PAGES.LOGIN, { errorMessage: response.data.message });
    }
  } catch (error) {
    logger.error(`Error encountered loginRoute post /login`, error);
    res.render(PAGES.LOGIN, {
      errorMessage: 'Error occurred while logging in. Please try again.',
    });
  }
});

loginRouter.get(ROUTES.LOGOUT, async (req, res) => {
  req.session.user = null; // clear user session
  res.redirect(PAGES.HOME);
});

module.exports = loginRouter;
