'use strict';

var express = require('express');
var routes = require('./routes');
// var http = require('http');

var app = express();
routes(app);

///////////////////////////////////////////////////
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'a1438JR420JR420',
  database : 'gentleman'
});

connection.connect();

connection.query('SELECT Database()', function(err, rows, fields) {
  if (err) throw err;
  console.log('rows and fields: ', rows );
});

connection.end();
///////////////////////////////////////////////////

var port = 6000;
app.listen( port );
console.log('listening to PORT:', port);
