const connectToDB = require("../../config/dbConnection")

exports.create = (data, callback) => {
  const connection = connectToDB()
  connection.query("INSERT INTO transactions SET ?", data, (error, results) => {
    connection.end()
    return callback(error, results)
  })
}

exports.forUserWithGiftIds = (userId, giftIds, callback) => {
  const connection = connectToDB()
  connection.query("SELECT * FROM transactions WHERE user_id = ? AND gift_id in ?", [userId, giftIds], (error, results) => {
    connection.end()
    return callback(error, results)
  })
}

exports.pendingUserRegistration = (userId, callback) => {
  const connection = connectToDB()
  connection.query("SELECT * FROM transactions WHERE status = 'pending user registration' AND user_id = ? ORDER BY created_at DESC", userId, (error, results) => {
    connection.end()
    return callback(error, results)
  })
}

exports.update = (id, transaction, callback) => {
  const connection = connectToDB()
  connection.query("UPDATE transactions SET ? WHERE id = ?", [transaction, id], (error, results) => {
    connection.end()
    return callback(error, results)
  })
}
