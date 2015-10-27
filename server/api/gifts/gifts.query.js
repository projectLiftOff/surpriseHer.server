const pool = require("../../config/dbPool")

exports.getAll = callback => {
  pool.query("SELECT * FROM gifts", callback)
}

exports.create = (gift, callback) => {
  pool.query("INSERT INTO gifts SET ?", gift, callback)
}

exports.forThisMonth = (date, callback) => {
  pool.query({
    sql: "SELECT * FROM gifts WHERE month_of = ?",
    values: [date]
  }, callback)
}
