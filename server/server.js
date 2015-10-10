'use strict';

///////////////////////////////////////////////////
// C: Set environment variables
var setupEnvironmentVariables = require('./config/environment.setup.js');
setupEnvironmentVariables();

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
