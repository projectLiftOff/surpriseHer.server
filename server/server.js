"user strict"

const setupEnvironmentVariables = require("./config/environment.setup.js")
setupEnvironmentVariables()

const express = require("express")
const configExpress = require("./config/express.middle.js")
const routes = require("./routes")
const log = require("./config/log.js")

const app = express()
configExpress(app)
routes(app)

// Start server services
// todo const monthlyGiftMessenger = require("./services/schedulers/monthly.schedule.js")
// todo monthlyGiftMessenger.monthlyScheduler()

const port = 6060
app.listen(port)
log.info("listening to PORT:", port)
