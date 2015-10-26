const fs = require("fs")

function setupEnvironmentVariables () {
  if (process.env.NODE_ENV === "production") {
    require("./log.js").info("running in production mode") // eslint-disable-line global-require
  } else {
    const environmentVariables = JSON.parse(fs.readFileSync("environmentVariables.json", "utf-8")) // eslint-disable-line no-sync
    for (let key in environmentVariables) { // eslint-disable-line prefer-const
      process.env[key] = environmentVariables[key]
    }
    require("./log.js").debug("runnning in dev mode") // eslint-disable-line global-require
  }
}

module.exports = setupEnvironmentVariables
