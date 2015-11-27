const connectToDB = require("../../config/dbConnection")

// exports.getAll = callback => {
//   connection.query("SELECT * FROM addresses", callback)
// }

exports.create = (address, callback) => {
  const connection = connectToDB()
  connection.query({sql: "INSERT INTO addresses SET ?", values: address}, (error, results) => {
    callback(error, results)
    connection.end()
  })
}

exports.ofUserWithPhone = (phone, callback) => {
  const connection = connectToDB()
  connection.query({
    sql: "SELECT code_name, user_id FROM addresses JOIN users USING(user_id) WHERE phone = ?",
    values: [phone]
  }, (error, results) => {
    callback(error, results)
    connection.end()
  })
}

exports.ofUserAndCode = (data, callback) => {
  const connection = connectToDB()
  connection.query("SELECT address_id FROM addresses WHERE code_name = ? AND user_id = ?", data, (error, results) => {
    callback(error, results)
    connection.end()
  })
}

exports.findByUserAndName = (userId, name, callback) => {
  const connection = connectToDB()
  connection.query("SELECT * FROM addresses WHERE user_id = ? AND code_name = ?", [userId, name], (error, results) => {
    callback(error, results)
    connection.end()
  })
}
