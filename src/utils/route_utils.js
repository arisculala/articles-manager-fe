const handleErrorMessageRedirect = (res, errorMessage, redirectUrl) => {
  res.redirect(redirectUrl, { errorMessage: errorMessage });
};

const handleErrorMessageRender = (res, errorMessage, renderUrl) => {
  res.render(renderUrl, { errorMessage: errorMessage });
};

const handleSuccessMessageRedirect = (res, successMessage, redirectUrl) => {
  res.redirect(redirectUrl, { successMessage: successMessage });
};

const handleSuccessMessageRender = (res, successMessage, renderUrl) => {
  res.render(renderUrl, { successMessage: successMessage });
};

module.exports = {
  handleErrorMessageRedirect,
  handleErrorMessageRender,

  handleSuccessMessageRedirect,
  handleSuccessMessageRender,
};
