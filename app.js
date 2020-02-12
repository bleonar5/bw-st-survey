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

    // user = req.session.currentUser;
    /* Reset the current user */

    req.session.currentUser = null;
    console.log(`req session reset`);

    res.render('index');
})

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