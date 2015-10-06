'use strict';

var mysql = require('mysql');

// exports.connectToDB = connectToDB;
// exports.connectToTestDB = connectToTestDB;

function connectToDB() {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'a1438JR420JR420',
      database : 'gentleman'
    });
    connection.connect(function(err){
        if(err) console.log(err);
        else console.log('connected to testing db');
    });
    return connection;
}

function connectToTestDB() {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : 'a1438JR420JR420',
      database : 'gentlemanTest'
    });
    connection.connect(function(err){
        if(err) console.log(err);
        else console.log('connected to local db');
    });
    return connection;
}
module.exports = connectToDB;