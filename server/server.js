'use strict';

var express = require('express');
var configExpress = require('./config/express.middle.js');
var routes = require('./routes');
// var http = require('http');

var app = express();
configExpress( app );
routes( app );

///////////////////////////////////////////////////
// C: Start server services
var monthlyGiftMessanger = require('./services/schedulers/monthly.schedule.js');
monthlyGiftMessanger.monthlyScheduler();


///////////////////////////////////////////////////

var port = 6060;
app.listen( port );
console.log('listening to PORT:', port);
