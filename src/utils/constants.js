// Define constants for routes
const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  REGISTER: '/register',
  PROFILE: '/profile',
  ARTICLES: '/articles',
  MY_ARTICLES: '/my-articles',
  // Add more routes as needed
};

// Define constants for page paths
const PAGES = {
  HOME: '/',
  LOGIN: 'pages/login',
  REGISTER: 'pages/register',
  PROFILE: 'pages/profile',
  ARTICLES: 'pages/articles',
  MY_ARTICLES: 'pages/my_articles',
  ARTICLE_EDITOR: 'pages/article_editor',
  // Add more page paths as needed
};

// Define constants for url redirect paths
const URLS_REDIRECT = {
  HOME: '/',
  ARTICLES: '/articles',
  PROFILE: '/profile',
  MY_ARTICLES: '/my-articles',
  // Add more url redirect paths as needed
};

module.exports = { ROUTES, PAGES, URLS_REDIRECT };
