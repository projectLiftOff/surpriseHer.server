const mysql = require("mysql")
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: process.env.db_password,
  database: "gentleman"
})

module.exports = {
  query: () => {
    // string, function
    // string, !function, function
    // object, function
    const options = typeof arguments[0] === "object" ? arguments[0] : {sql: arguments[0]}
    const hasValues = typeof arguments[1] !== "function"
    if (hasValues) {
      options.values = arguments[1]
    }
    const callback = arguments[hasValues ? 2 : 1]

    pool.getConnection((connectionError, connection) => {
      function callbackAndRelease (error, rows) {
        if (connection) { connection.release() }
        return callback(error, rows)
      }
      if (connectionError) {
        callbackAndRelease(connectionError)
      } else {
        connection.query(options, callbackAndRelease)
      }
    })
  }
}
