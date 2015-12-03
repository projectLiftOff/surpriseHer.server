"use strict"

const mysql = require("mysql")
const log = require("./log.js")
const dbReconnectionInterval = 3000

function connectToDB () {
  const connection_params = {
    host: process.env.db_host || "localhost",
    user: process.env.db_username || "root",
    password: process.env.db_password || "",
    database: process.env.db_database || "gentleman"
  }
  let connection = mysql.createConnection(connection_params)
  connection.on("error", err => {
    log.error("ARMANDO DOESN'T BELIEVE", err.code)
    setTimeout(() => {
      connection = connectToDB()
    }, dbReconnectionInterval)
  })
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

global.Db = {
  query: (sql, data, callback) => {
    const connection = connectToDB()
    connection.query(sql, data, (error, results) => {
      connection.end()
      return callback(error, results)
    })
  }
}

module.exports = connectToDB
