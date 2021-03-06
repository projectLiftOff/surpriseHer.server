const connectToDB = require("../../config/dbConnection")

// exports.getAll = callback => {
//   connection.query("SELECT * FROM gifts", callback)
// }

// exports.create = (gift, callback) => {
//   connection.query("INSERT INTO gifts SET ?", gift, callback)
// }

exports.availableForCurrentMonth = (date, callback) => {
  const connection = connectToDB()
  connection.query({sql: "SELECT * FROM gifts WHERE month_of = ? OR month_of = '0';", values: [date]}, (error, results) => {
    connection.end()
    return callback(error, results)
  })
}

exports.availableAfterSignUp = callback => {
  const connection = connectToDB()
  connection.query("SELECT * FROM gifts WHERE month_of = '0';", (error, results) => {
    connection.end()
    return callback(error, results)
  })
}

exports.findByName = (name, callback) => {
  const connection = connectToDB()
  connection.query("SELECT * FROM gifts WHERE look_up = ?", name, (error, results) => {
    connection.end()
    return callback(error, results)
  })
}

exports.findById = (id, callback) => {
  const connection = connectToDB()
  connection.query("SELECT * FROM gifts WHERE id = ?", id, (error, results) => {
    connection.end()
    return callback(error, results)
  })
}
