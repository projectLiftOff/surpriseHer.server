'use strict';

// Set environment variables
if(process.env.NODE_ENV === 'production'){
  console.log('running in production mode');
} else {
  console.log('runnning in dev mode');
  var fs = require('fs');
  var environmentVariables = JSON.parse(fs.readFileSync('local_environment_variables.json', 'utf-8'));
  for (var key in environmentVariables) {
    process.env[key] = environmentVariables[key];
  }
}

var express = require('express');
var configExpress = require('./config/express.middle.js');
var routes = require('./routes');
var log = require('./config/winstonLogger.js');

var app = express();
configExpress( app );
routes( app );

///////////////////////////////////////////////////
// C: Start server services
var monthlyGiftMessanger = require('./services/schedulers/monthly.schedule.js');
// monthlyGiftMessanger.monthlyScheduler();



///////////////////////////////////////////////////

var port = 6060;
app.listen( port );
log.info('listening to PORT:', port)
