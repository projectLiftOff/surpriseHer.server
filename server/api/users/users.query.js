exports.getAll = callback => {
  global.Db.query("SELECT * FROM users", null, callback)
}

exports.update = (data, callback) => {
  global.Db.query("UPDATE users SET ? WHERE id = ?", data, callback)
}

exports.create = (user, callback) => {
  global.Db.query("INSERT INTO users SET ?", user, callback)
}

// exports.availableForGifts = callback => {
//   connection.query("SELECT first_name, phone FROM users JOIN subscriptions USING(user_id) JOIN plans USING(plan_id) WHERE gifts > gifts_ordered AND deposit=1", callback)
// }

exports.findByPhone = (date, callback) => {
  global.Db.query("SELECT * FROM users WHERE phone = ?", date, callback)
}
