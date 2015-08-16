'use strict';

var express = require('express');
var routes = require('./routes');
// var http = require('http');

var app = express();
routes( app );

///////////////////////////////////////////////////

// connection.end();
///////////////////////////////////////////////////

var port = 6060;
app.listen( port );
console.log('listening to PORT:', port);
