const pool = require("../../config/dbPool.js")

exports.getAll = callback => {
  pool.query("SELECT * FROM addresses", callback)
}

exports.create = (address, callback) => {
  pool.query("INSERT INTO addresses SET ?", address, callback)
}

exports.ofUserWithPhone = (phone, callback) => {
  pool.query({
    sql: "SELECT code_name, user_id FROM addresses JOIN users USING(user_id) WHERE phone = ?",
    values: [phone]
  }, callback)
}

exports.ofUserAndCode = (data, callback) => {
  pool.query("SELECT address_id FROM addresses WHERE code_name = ? AND user_id = ?", data, callback)
}
