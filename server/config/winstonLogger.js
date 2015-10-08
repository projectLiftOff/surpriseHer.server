var winston = require('winston');
var slack = require('winston-bishop-slack').Slack;

winston.emitErrs = true;

var log = new winston.Logger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/all.log',
            name: 'file.all',
            handleExceptions: true,
            json: true,
            timestamp : true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        }),

        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            timestamp : true,
            colorize: true,
            prettyPrint: true
        }),

        new winston.transports.File({
            level: 'error',
            filename: './logs/error.log',
            name: 'file.error',
            handleExceptions: true,
            json: true,
            timestamp : true,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: true
        })
    ],
    exitOnError: false,
    colors: {
        info: 'blue',
        error: 'red',
        warning: 'yellow',
        debug: 'green'
    }
});

log._info = function(){
    var args = [];
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    args.push( {pid: process.pid} );
    log.info.apply( null, args );
}
log._warn = function(){
    var args = [];
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    args.push( {pid: process.pid} );
    log.warn.apply( null, args );
}
log._error = function(){
    var args = [];
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    args.push( {pid: process.pid} );
    log.error.apply( null, args );
}
log._debug = function(){
    var args = [];
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    args.push( {pid: process.pid} );
    log.debug.apply( null, args );
}

// C: Slack logging intergration
log.add(slack, {
  webhook_url: process.env.slack_webhook_url,
  icon_url: "https://twylalalala.files.wordpress.com/2014/01/dafuq-100981.jpg?w=390",
  channel: "#sh-errors-dev",
  username: "The Error Dude",
  level: 'error',
  handleExceptions: true
})

module.exports = log;
