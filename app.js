const express = require('express');
const session = require('express-session');
const { addSessionUserToLocals } = require('./src/middlewares/session');
const logger = require('./src/utils/logger');
require('dotenv').config();

const environment = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 8080;

const app = express();

// Set-up session middleware
app.use(
  session({
    secret: 'your_secret_key_here', // secret key to sign the session ID cookie
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // for HTTPS set it to true
  }),
);

// Add middleware to make req.session variables available in all EJS templates
app.use(addSessionUserToLocals);

// Static files
app.use(express.static('public'));

// Templating engine
app.set('views', './src/views');
app.set('view engine', 'ejs');

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Routes
const loginRouter = require('./src/routes/login.route');
app.use(loginRouter);

const registerRouter = require('./src/routes/register.route');
app.use(registerRouter);

const articlesRouter = require('./src/routes/article.route');
app.use(articlesRouter);

const profileRouter = require('./src/routes/profile.route');
app.use(profileRouter);

// Listen on port 8080
app.listen(PORT, () =>
  logger.info(
    `🚀 [${environment}] Articles-Manager-FE Service listening on port ${PORT} 🚀`,
  ),
);
