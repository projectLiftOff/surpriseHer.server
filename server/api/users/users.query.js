const connectToDB = require("../../config/dbConnection")

// exports.getAll = callback => {
//   connection.query("SELECT * FROM users", (callback) => {
//     callback()
//     connection.end()
//   })
// }

exports.update = (data, callback) => {
  const connection = connectToDB()
  connection.query("UPDATE users SET ? WHERE id = ?", data, (error, results) => {
    callback(error, results)
    connection.end()
  })
}

exports.create = (user, callback) => {
  const connection = connectToDB()
  connection.query("INSERT INTO users SET ?", user, (error, results) => {
    callback(error, results)
    connection.end()
  })
}

// exports.availableForGifts = callback => {
//   connection.query("SELECT first_name, phone FROM users JOIN subscriptions USING(user_id) JOIN plans USING(plan_id) WHERE gifts > gifts_ordered AND deposit=1", callback)
// }

exports.findByPhone = (date, callback) => {
  const connection = connectToDB()
  connection.query("SELECT * FROM users WHERE phone = ?", date, (error, results) => {
    callback(error, results)
    connection.end()
  })
}
