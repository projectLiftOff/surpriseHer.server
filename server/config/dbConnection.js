'use strict';

var mysql = require('mysql');

function connectToDB() {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'a1438JR420JR420',
      database : 'gentleman'
    });
    connection.connect();
    return connection;
}
module.exports = connectToDB;