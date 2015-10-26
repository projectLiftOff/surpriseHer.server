const connectToDB = require("../../config/dbConnection")
const connection = connectToDB()
const log = require("../../config/log.js")

exports.getAll = callback => {
  connection.query("SELECT * FROM addresses", (error, rows) => {
    if (error) { log.error("query failed: addresses.getAll", {error}) }
    callback(error, rows)
  })
}

exports.create = (address, callback) => {
  connection.query("INSERT INTO addresses SET ?", address, callback)
}

exports.ofUserWithPhone = (phone, callback) => {
  connection.query({
    sql: "SELECT nick_name, user_id FROM addresses JOIN users USING(user_id) WHERE phone = ?",
    values: [phone]
  }, (error, results) => {
    if (error) { log.error("query failed: addresses.ofUserWithPhone", {error}) }
    callback(error, results)
  })
}

exports.ofUserAndCode = (data, callback) => {
  connection.query("SELECT address_id FROM addresses WHERE code_name = ? AND user_id = ?", data, (error, results) => {
    if (error) { log.error("query failed: addresses.ofUserAndCode", {error}) }
    callback(error, results)
  })
}
