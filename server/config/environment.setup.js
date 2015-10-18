'use strict';

function setupEnvironmentVariables() {
    if (process.env.NODE_ENV === 'production') {
        console.log('running in production mode');
    } else {
        console.log('runnning in dev mode');
        var fs = require('fs');
        var environmentVariables = JSON.parse(fs.readFileSync('environmentVariables.json', 'utf-8'));
        for (var key in environmentVariables) {
            process.env[key] = environmentVariables[key];
        }
    }
}

module.exports = setupEnvironmentVariables;
