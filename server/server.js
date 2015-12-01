const setupEnvironmentVariables = require("./config/environment.setup.js")
setupEnvironmentVariables()

global.Log = require("./config/log.js")

const express = require("express")
const configExpress = require("./config/express.middle.js")
const routes = require("./routes")

const app = express()
configExpress(app)
routes(app)

// Start server services
// todo const monthlyGiftMessenger = require("./services/schedulers/monthly.schedule.js")
// todo monthlyGiftMessenger.monthlyScheduler()

module.exports = app
