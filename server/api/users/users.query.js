exports.getAll = callback => {
  global.Db.query("SELECT * FROM users", null, callback)
}

exports.update = (data, callback) => {
  global.Db.query("UPDATE users SET ? WHERE id = ?", data, callback)
}

exports.create = (user, callback) => {
  global.Db.query("INSERT INTO users SET ?", user, callback)
}

exports.findByPhone = (date, callback) => {
  global.Db.query("SELECT * FROM users WHERE phone = ?", date, callback)
}
