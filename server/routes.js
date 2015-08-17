'use strict';

var usersRequestHandlers = require('./api/users/users.main');

module.exports = routes;
    
function routes( app ){
    app.use('/users', usersRequestHandlers);
}