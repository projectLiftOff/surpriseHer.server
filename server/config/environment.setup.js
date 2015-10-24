'use strict';

function setupEnvironmentVariables() {
    if (process.env.NODE_ENV === 'production') {
        var log = require('./log.js')
        log.info('running in production mode');
    } else {
        var fs = require('fs');
        var environmentVariables = JSON.parse(fs.readFileSync('environmentVariables.json', 'utf-8'));
        for (var key in environmentVariables) {
            process.env[key] = environmentVariables[key];
        }
        var log = require('./log.js')
        log.debug('runnning in dev mode');
    }
}

module.exports = setupEnvironmentVariables;
