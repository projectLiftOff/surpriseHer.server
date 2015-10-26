const connectToDB = require("../../config/dbConnection")
const connection = connectToDB()
const log = require("./../../config/log.js")

exports.getAll = callback => {
  connection.query("SELECT * FROM users", (error, rows) => {
    if (error) { log.error("query failed: users.getAll", {error}) }
    callback(error, rows)
  })
}

exports.update = (data, callback) => {
  connection.query("UPDATE users SET ? WHERE user_id = ?", data, (error, results) => {
    if (error) { log.error("query failed: users.update", {error}) }
    callback(error, results)
  })
}

exports.create = (user, callback) => {
  connection.query("INSERT INTO users SET ?", user, (error, results) => {
    if (error) { log.error("query failed: users.create", {error}) }
    callback(error, results)
  })
}

exports.availableForGifts = callback => {
  connection.query("SELECT first_name, phone FROM users JOIN subscriptions USING(user_id) JOIN plans USING(plan_id) WHERE gifts > gifts_ordered AND deposit=1", (error, results) => {
    if (error) { log.error("query failed: users.availableForGifts", {error}) }
    callback(error, results)
  })
}

exports.withPhoneNumber = (date, callback) => {
  connection.query("SELECT * FROM users WHERE phone = ?", date, (error, results) => {
    if (error) { log.error("query failed: users.withPhoneNumber", {error}) }
    callback(error, results)
  })
}
