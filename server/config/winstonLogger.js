var winston = require('winston');
var slack = require('winston-bishop-slack').Slack;

winston.emitErrs = true;

var logger = new winston.Logger({
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
        }),

        // new something({
        //     domain: 'ilove2party',
        //     apiToken: 'xoxp-4186932621-4186932639-10324292422-47a7c9',
        //     channel: '#general',
        //     level: 'info',
        //     username: "ErrorBot",
        //     handleExceptions : true
        // })

    ],
    exitOnError: false,

    colors: {
        info: 'blue',
        error: 'red',
        warning: 'yellow',
        debug: 'green'
    }
});

logger._info = function(){
    var args = [];
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    args.push( {pid: process.pid} );
    logger.info.apply( null, args );
}
logger._warn = function(){
    var args = [];
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    args.push( {pid: process.pid} );
    logger.warn.apply( null, args );
}
logger._error = function(){
    var args = [];
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    args.push( {pid: process.pid} );
    logger.error.apply( null, args );
}
logger._debug = function(){
    var args = [];
    for( var i = 0; i < arguments.length; i++ ) {
        args.push( arguments[i] );
    }
    args.push( {pid: process.pid} );
    logger.debug.apply( null, args );
}

// C: Slack logging intergration
logger.add(slack, {
  webhook_url: "",
  icon_url: "https://twylalalala.files.wordpress.com/2014/01/dafuq-100981.jpg?w=390",
  channel: "#tg-errors",
  username: "The Error Dude",
  level: 'error',
  handleExceptions: true
})

module.exports = logger;
