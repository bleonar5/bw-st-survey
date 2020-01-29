require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session')
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const logger       = require('morgan');
const mongoose     = require('mongoose');
const path         = require('path');

const app          = express();

// Session and MongoStore required for Authentication and Session
const session    = require("express-session");
const MongoStore = require("connect-mongo")(session);

// Prevent Deprecation Warning by adding useUnifiedTopology: true
mongoose

    /* ----- WARNING: Remember to flip database ----
    You always need to remember to switch back to the MongoDB when making the site live
    It's a common mistake to leave the connection to the localhost
    */
    // .connect('mongodb://localhost/superteams_dev_15', 
    .connect(process.env.MONGODB_URI,
    {useUnifiedTopology: true,
    useNewUrlParser: true})
    .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
    })
    .catch(err => {
    console.error('Error connecting to Mongo', err)
    });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cookieSession({
    name: 'session',
    // keys: [/* secret keys */],
    keys: ['key1', 'key2'],
  
    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.get('/', function (req, res, next) {
    // Update views
    req.session.views = (req.session.views || 0) + 1
    user = req.session.currentUser;
    // Write response
    console.log(`logged in as ${user}`);
    console.log(`user has had ${req.session.views} views`);

    res.render('index');
})


// Configure Middleware to enable sessions in Express
/* Commenting out the below as we want to test whether cookies are working before deciding on whether we want a username/password/sign-in scenario
app.use(session({
  // secret is used to sign the session ID cookie
  secret: "basic-auth-secret",
  // cookie is the object for the session ID cookie
  cookie: { maxAge: 60000 },
  // Sets the session store instance. In this case we can store the session information in our Mongo database
  // todo: Ask what is the standard practice for how long we store session information
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));
*/

// Express view engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
     
app.set('views', path.join(__dirname, 'views'));
// Setup view engine
app.set('view engine', 'hbs');

// Set location of partials
hbs.registerPartials(__dirname + '/views/partials')

// This is also Middleware when we say where the static files are
app.use(express.static(path.join(__dirname, 'public')));
// Temporarily removed. Don't think you need this line as well.
// app.use('*/css',express.static('public/css'));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// Default value for the title local
app.locals.title = 'Superteams Survey';

// Essential Step. None of the routes will work otherwise
const router = require('./routes/auth');
app.use('/', router);

// Essential Step. You have to do this
app.use('/', require('./routes/site-routes'));

// We are connecting the routes to app.js. All route files need to follow this pattern
const index = require('./routes/index');
app.use('/', index);

module.exports = app;