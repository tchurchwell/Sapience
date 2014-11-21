'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
    session = require('express-session'),
    expressValidator = require('express-validator'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    flash = require('connect-flash'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    mongoStore = require('connect-mongo')(session),
    helpers = require('view-helpers'),
    config = require('./config'),
    swig = require('swig'),
    expressLoad = require('express-load');

module.exports = function(app) {
    app.set('showStackError', true);

    // Prettify HTML
    app.locals.pretty = true;
    // cache=memory or swig dies in NODE_ENV=production
    app.locals.cache = 'memory';

    // Should be placed before express.static
    // To ensure that all assets and data are compressed (utilize bandwidth)
    app.use(compression({
        filter: function(req, res) {
            return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
        },
        // Levels are specified in a range of 0 to 9, where-as 0 is
        // no compression and 9 is best compression, but slowest
        level: 9
    }));

    // This is where all the magic happens!
    app.engine('html', swig.renderFile);

    // set .html as the default extension
    app.set('view engine', 'html');

    // Set views path, template engine and default layout
    app.set('views', config.root + '/public/views');

    // Enable jsonp
    app.enable('jsonp callback');

    // The cookieParser should be above session
    app.use(cookieParser());

    // Request body parsing middleware should be above methodOverride
    app.use(expressValidator());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(methodOverride());

    // Express/Mongo session storage
    app.use(session({
        name: 'sapience.session.id',
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true,
        store: new mongoStore({
            db: app.db.connection.db,
            collection: config.sessionCollection
        })
    }));

    // Dynamic helpers
    app.use(helpers(config.app.name));

    // Connect flash for flash messages
    app.use(flash());

    // Use passport session
    app.use(app.passport.initialize());
    app.use(app.passport.session());

    // Bootstrap Routes into app
    expressLoad('../server/routes', {
        extlist: /(.*)\.(js$)/,
        cwd: __dirname
    }).into(app);

    // Setting the fav icon and static folder
    app.use(favicon(__dirname + '/../public/img/favicon.ico'));

    var viewsDir = config.root + '/public';
    app.use(express.static(viewsDir));

    // Only use logger for development environment
    if (process.env.NODE_ENV === 'local') {
        console.log('You are developing locally, let me disable cache for....');
        app.use(logger('dev'));
        // Swig will cache templates for you, but you can disable
        // that and use Express's caching instead, if you like:
        app.set('view cache', false);
        // To disable Swig's cache, do the following:
        swig.setDefaults({
            cache: false
        });
    }

    // Assume "not found" in the error message is a 404. this is somewhat
    // silly, but valid, you can do whatever you like, set properties,
    // use instanceof etc.
    app.use(function(err, req, res, next) {
        // Treat as 404
        if (err.message && err.message.indexOf('not found')) {
            return next();
        }

        // Log it
        console.error(err.stack || err);

        // Error page
        res.status(500).send('500', {
            error: err.stack || err
        });
    });

    // Assume 404 since no middleware responded
    app.use(function(req, res) {
        res.status(404).send('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });

    function errorHandler(err, req, res) {
        res.status(500);
        res.render('error', {
            error: err
        });
    }

    app.use(errorHandler);

    // Do not stop server on any unhandled error
    process.on('uncaughtException', function(err) {
        console.error('UNCAUGHT EXCEPTION\n' + err.stack || err.message);
    });

};
