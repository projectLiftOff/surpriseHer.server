const connectToDB = require("../../config/dbConnection")
const connection = connectToDB()
const log = require("./../../config/log.js")

exports.getAll = callback => {
  connection.query("SELECT * FROM subscriptions", (error, rows) => {
    if (error) { log.error("query failed: subscriptions.getAll", {error}) }
    callback(error, rows)
  })
}

exports.create = (subscription, userInsertResult, callback) => {
  subscription.user_id = userInsertResult.insertId // eslint-disable-line camelcase
  connection.query("INSERT INTO subscriptions SET ?", subscription, (error, results) => {
    if (error) { log.error("query failed: subscriptions.create", {error}) }
    callback(error, results)
  })
}

exports.update = (req, callback) => {
  const values = [req.body.deposit, Number(req.params.id)]
  connection.query("UPDATE subscriptions SET deposit = ? WHERE subscription_id = ?", values, (error, results) => {
    if (error) { log.error("query failed: subscriptions.update", {error}) }
    callback(error, results)
  })
}
