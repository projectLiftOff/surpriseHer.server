const connectToDB = require("../../config/dbConnection")
const connection = connectToDB()

exports.getAll = callback => {
  connection.query("SELECT * FROM users", callback)
}

exports.update = (data, callback) => {
  connection.query("UPDATE users SET ? WHERE user_id = ?", data, callback)
}

exports.create = (user, callback) => {
  connection.query("INSERT INTO users SET ?", user, callback)
}

exports.availableForGifts = callback => {
  connection.query("SELECT first_name, phone FROM users JOIN subscriptions USING(user_id) JOIN plans USING(plan_id) WHERE gifts > gifts_ordered AND deposit=1", callback)
}

exports.withPhoneNumber = (date, callback) => {
  connection.query("SELECT * FROM users WHERE phone = ?", date, callback)
}
