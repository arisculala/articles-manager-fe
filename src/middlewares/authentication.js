// Define an array of restricted URLs
const restrictedUrls = ['/profile', '/my-articles'];

// Middleware to check if the user is logged in and has access to the requested URL
function isLoggedIn(req, res, next) {
  // Check if the user is logged in
  if (req.session.user) {
    // User is logged in, proceed to the next middleware
    next();
  } else {
    // User is not logged in, redirect to the homepage
    res.redirect('/');
  }
}

// Middleware to check if the user has access to the requested URL
function hasAccess(req, res, next) {
  // Get the requested URL
  const requestedUrl = req.originalUrl;

  // Check if the requested URL is in the list of restricted URLs
  if (restrictedUrls.includes(requestedUrl)) {
    // Check if the user is logged in
    if (req.session.user) {
      // User is logged in and has access, proceed to the next middleware
      next();
    } else {
      // User is not logged in or does not have access, redirect to the 404 page
      res.status(404).render('404'); // Render the 404.ejs page
    }
  } else {
    // Requested URL is not restricted, proceed to the next middleware
    next();
  }
}

// Export the middleware functions
module.exports = {
  isLoggedIn,
  hasAccess,
};
