'use strict';

// Utilize Lo-Dash utility library
var _ = require('lodash'),
    pathExtra = require('path-extra'),
    fs = require('fs');

var userConfigFileName = pathExtra.homedir() + '/sapience-' + process.env.NODE_ENV + '.json',
    envConfigFileName = __dirname + '/../config/env/' + process.env.NODE_ENV + '.js',
    userConfig = fs.existsSync(userConfigFileName) ? require(userConfigFileName) : {},

    // Extend the base configuration in all.js with environment
    // specific configuration
    config = _.extend(
        require(__dirname + '/../config/env/all.js'),
        fs.existsSync(envConfigFileName) ? require(envConfigFileName) : {},
        userConfig
    );

config.db = 'mongodb://{username}:{password}@{host}:{port}/{database}'
    .replace('{username}:', _.isEmpty(config.db.username) ? '' : config.db.username + ':')
    .replace('{password}@', _.isEmpty(config.db.password) ? '' : config.db.password + '@')
    .replace('{host}', config.db.host)
    .replace('{port}', config.db.port)
    .replace('{database}', config.db.database);

module.exports = config;
