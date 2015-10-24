'user strict'

var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');

var publicPath = path.join(__dirname, '../public')

module.exports = function(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(publicPath));
}