    'use strict';

var expect = require('chai').expect;
var request = require('superagent');
var baseUrl = 'http://localhost:6060'
var _Seperator = '\n/////////////////////////////////////////////////////////////';

var connection = require('../../../config/dbConnection.js').connectToTestDB;

connection.connect(function(err){
  if(err) console.log(err);
  console.log('connected to local db');
});

describe('Transactions API'+_Seperator, function(){
    
    describe('When empty POST request.body: {} at /transactions', function(){
        it('should respond with err and 400', function(done){
            request.post( baseUrl + '/transactions' ).end(function assert(err, res){
                expect(err).to.be.ok;
                expect(res).to.have.property('status', 400);
                // TODO: test error message
                done();
            });
        });
    });

    describe('When POST request.body has incorrect date', function(){
        it('should respond with err and 400', function(done){
            var data = { "Body": "32 neckless1 Home", "From": "+15034282359" };
            request.post( baseUrl + '/transactions' ).send().end(function assert(err, res){
                expect(err).to.be.ok;
                expect(res).to.have.property('status', 400);
                // TODO: test error message
                done();
            });
        });
    });

});