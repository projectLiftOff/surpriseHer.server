'use strict';

var mysql = require('mysql');
var log = require('./log.js')

function connectToDB() {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : process.env.db_password,
      database : 'gentleman'
    });
    connection.connect(function(error){
        if(error) log.debug('connected to testing db', {error});
        else log.debug('connected to testing db');
    });
    return connection;
}

module.exports = connectToDB;
