'use strict';

var mysql = require('mysql');

function connectToDB() {
    var connection = mysql.createConnection({
      host     : 'localhost',
      user     : 'root',
      password : process.env.db_password,
      database : 'gentleman'
    });
    connection.connect(function(err){
        if(err) console.log(err);
        else console.log('connected to testing db');
    });
    return connection;
}

module.exports = connectToDB;
