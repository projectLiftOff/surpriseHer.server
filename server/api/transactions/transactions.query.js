const connectToDB = require("../../config/dbConnection")
const connection = connectToDB()
const log = require("./../../config/log.js")

exports.create = (data, callback) => {
  connection.query("INSERT INTO transactions SET ?", data, (error, results) => {
    if (error) { log.error("query failed: transactions.create", {error}) }
    callback(error, results)
  })
}

exports.forUserWithGiftIds = (userId, giftIds, callback) => {
  const values = giftIds
  values.unshift(userId)
  connection.query({
    sql: "SELECT * FROM transactions WHERE user_id = ? AND gift_id = ? OR gift_id = ? OR gift_id = ?",
    values
  }, (error, results) => {
    if (error) { log.error("query failed: transactions.forUserWithGiftIds", {error}) }
    callback(error, results, userId)
  })
}

exports.pendingUserRegistration = (userId, callback) => {
  const values = [userId]
  connection.query("SELECT * FROM transactions WHERE status = 'pendingUserRegistration' AND user_id = ?", values, (error, results) => {
    if (error) { log.error("query failed: transactions.pendingUserRegistration", {error}) }
    callback(error, results)
  })
}

exports.update = (data, callback) => {
  connection.query("UPDATE transactions SET ? WHERE transactions_id = ?", data, (error, results) => {
    if (error) { log.error("query failed: transactions.update", {error}) }
    callback(error, results)
  })
}
