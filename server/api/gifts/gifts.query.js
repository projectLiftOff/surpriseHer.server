const pool = require("../../config/dbPool")

exports.getAll = callback => {
  pool.query("SELECT * FROM gifts", callback)
}

exports.create = (gift, callback) => {
  pool.query("INSERT INTO gifts SET ?", gift, callback)
}

exports.availableForCurrentMonth = (date, callback) => {
  pool.query({
    sql: "SELECT * FROM gifts WHERE month_of = ? OR month_of = '0';",
    values: [date]
  }, callback)
}

exports.afterSignUp = callback => {
  pool.query("SELECT * FROM gifts WHERE month_of = '0';", callback)
}
