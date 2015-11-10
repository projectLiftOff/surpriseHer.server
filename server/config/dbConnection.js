const mysql = require("mysql")
const log = require("./log.js")

function connectToDB () {
  const connection_params = {
    host: process.env.db_host || "localhost",
    user: process.env.db_username || "root",
    password: process.env.db_password || "",
    database: process.env.db_database || "gentleman"
  }
  log.debug({connection_params})
  const connection = mysql.createConnection(connection_params)
  connection.connect(error => {
    if (error) {
      log.debug("Error connecting to db.", {error})
    } else if (process.env.NODE_ENV === "production") {
      log.debug("Connected to production db.")
    } else {
      log.debug("Connected to test db.")
    }
  })
  return connection
}

module.exports = connectToDB
