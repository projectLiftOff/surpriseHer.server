const connectToDB = require("../../config/dbConnection")
const connection = connectToDB()

exports.getAll = callback => {
  connection.query("SELECT * FROM gifts", callback)
}

exports.create = (gift, callback) => {
  connection.query("INSERT INTO gifts SET ?", gift, callback)
}

exports.availableForCurrentMonth = (date, callback) => {
  connection.query({
    sql: "SELECT * FROM gifts WHERE month_of = ? OR month_of = '0';",
    values: [date]
  }, callback)
}

exports.afterSignUp = callback => {
  connection.query("SELECT * FROM gifts WHERE month_of = '0';", callback)
}

exports.findByName = (name, callback) => {
  connection.query("SELECT * FROM gifts WHERE look_up = ?", name, callback)
}
