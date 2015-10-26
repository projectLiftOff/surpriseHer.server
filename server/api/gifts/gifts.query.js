const connectToDB = require("../../config/dbConnection")
const connection = connectToDB()
const log = require("./../../config/log.js")

exports.getAll = callback => {
  connection.query("SELECT * FROM gifts", (error, rows) => {
    if (error) { log.error("query failed: gifts.getAll", {error}) }
    callback(error, rows)
  })
}

exports.create = (gift, callback) => {
  connection.query("INSERT INTO gifts SET ?", gift, (error, results) => {
    if (error) { log.error("query failed: gifts.create", {error}) }
    callback(error, results)
  })
}


exports.availableForCurrentMonth = (date, callback) => {
  connection.query({
    sql: 'SELECT * FROM gifts WHERE month_of = ? OR month_of = "0";',
    values: [date]
  }, (error, results) => {
    if (error) { log.error("query failed: gifts.forThisMonth", {error}) }
    callback(error, results)
  })
}

exports.afterSignUp = ( callback ) => {
    connection.query('SELECT * FROM gifts WHERE month_of = "0";', (error, results, fields) => {
        if (error) { log.error("query failed: gifts.afterSignUp", {error}) } 
        callback(err, results);
    });
}

