'user strict'

var bodyParser = require('body-parser');
var express = require('express');
var dirnameArray =  __dirname.split('/');
var path = dirnameArray.slice(0, dirnameArray.length - 1).join('/');

module.exports = function(app) {
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(path + '/public'));
    // TODO add loging middle
}