const connectToDB = require("../../config/dbConnection")
const connection = connectToDB()

exports.create = (data, callback) => {
  connection.query("INSERT INTO transactions SET ?", data, callback)
}

exports.forUserWithGiftIds = (userId, giftIds, callback) => {
  connection.query("SELECT * FROM transactions WHERE user_id = ? AND gift_id in ?", [userId, giftIds], callback)
}

exports.pendingUserRegistration = (userId, callback) => {
  connection.query("SELECT * FROM transactions WHERE status = 'pending user registration' AND user_id = ?", userId, callback)
}

exports.update = (data, callback) => {
  connection.query("UPDATE transactions SET ? WHERE transactions_id = ?", data, callback)
}
