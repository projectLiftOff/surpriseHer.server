const mysql = require("mysql")
const log = require("./log.js")

function connectToDB () {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.db_password,
    database: "gentleman"
  })
  connection.connect(error => {
    if (error) {
      log.debug("connected to testing db", {error})
    } else {
      log.debug("connected to testing db")
    }
  })
  return connection
}

module.exports = connectToDB
