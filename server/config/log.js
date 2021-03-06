const localInfo = [process.env.NODE_ENV, process.env.USER]
const isProduction = process.env.NODE_ENV === "production"
const winston = require("winston")
const winstonSlack = require("winston-bishop-slack").Slack
require("winston-loggly")

winston.emitErrs = true
const winstonLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      json: false,
      timestamp: true,
      colorize: true,
      prettyPrint: true
    })
  ],
  exitOnError: false,
  colors: {
    debug: "green",
    info: "blue",
    error: "red"
  }
})

if (isProduction) {
  winstonLogger.add(winston.transports.Loggly, {
    token: process.env.winston_loggly_token,
    subdomain: "surpriseher",
    tags: ["Winston-NodeJS"],
    level: "info",
    json: true
  })
  winstonLogger.add(winstonSlack, {
    webhook_url: process.env.winston_slack_webhook, // eslint-disable-line camelcase
    icon_url: "https://twylalalala.files.wordpress.com/2014/01/dafuq-100981.jpg?w=390", // eslint-disable-line camelcase
    channel: "#sh-errors-dev",
    username: "The Error Dude",
    level: "error",
    handleExceptions: true
  })
}

function debug () {
  // logged to console
  winstonLogger.debug.apply(null, localInfo.concat([].slice.call(arguments)))
}

function info () {
  // logged to console, all.log
  winstonLogger.info.apply(null, localInfo.concat([].slice.call(arguments)))
}

function error () {
  // logged to console, all.log, error.log, and slack
  winstonLogger.error.apply(null, localInfo.concat([].slice.call(arguments)))
}

module.exports = {
  debug,
  info,
  error
}
