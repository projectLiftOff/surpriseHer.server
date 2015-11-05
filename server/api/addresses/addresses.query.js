const connectToDB = require("../../config/dbConnection")
const connection = connectToDB()

exports.getAll = callback => {
  connection.query("SELECT * FROM addresses", callback)
}

exports.create = (address, callback) => {
  connection.query({sql: "INSERT INTO addresses SET ?", values: address}, callback)
}

exports.ofUserWithPhone = (phone, callback) => {
  connection.query({
    sql: "SELECT code_name, user_id FROM addresses JOIN users USING(user_id) WHERE phone = ?",
    values: [phone]
  }, callback)
}

exports.ofUserAndCode = (data, callback) => {
  connection.query("SELECT address_id FROM addresses WHERE code_name = ? AND user_id = ?", data, callback)
}
