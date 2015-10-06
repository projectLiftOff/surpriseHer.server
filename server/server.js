'use strict';

var express = require('express');
var configExpress = require('./config/express.middle.js');
var routes = require('./routes');
var logger = require('./config/winstonLogger.js');

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
logger.info('listening to PORT:', port)
