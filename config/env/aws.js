'use strict';

module.exports = {
    app: {
        title: 'Quality Metrics Prod'
    },
    db: {
        host: 'localhost',
        port: 27017,
        database: 'sapience-social',
        username: '',
        password: ''
    },
    passport: {
        facebook: {
            clientID: '699766656776373',
            clientSecret: 'aa5dbfa35d54c7897c217acb2cc75135',
            callbackURL: 'http://sapience.qualityagile.com/auth/facebook/callback'
        },
        twitter: {
            clientID: 'CONSUMER_KEY',
            clientSecret: 'CONSUMER_SECRET',
            callbackURL: 'http://sapience.qualityagile.com/auth/twitter/callback'
        },
        github: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://sapience.qualityagile.com/auth/github/callback'
        },
        google: {
            clientID: 'APP_ID',
            clientSecret: 'APP_SECRET',
            callbackURL: 'http://sapience.qualityagile.com/auth/google/callback'
        },
        linkedin: {
            clientID: '75yarpoenxjeys',
            clientSecret: 'VJBCUicSXeUEOdfT',
            callbackURL: 'http://54.210.110.49:3010/auth/linkedin/callback'
        }
    }
};
