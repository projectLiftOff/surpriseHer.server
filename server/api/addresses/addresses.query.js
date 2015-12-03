// exports.getAll = callback => {
//   connection.query("SELECT * FROM addresses", callback)
// }

exports.create = (address, callback) => {
  global.Db.query("INSERT INTO addresses SET ?", address, callback)
}

exports.ofUserWithPhone = (phone, callback) => {
  global.Db.query("SELECT code_name, user_id FROM addresses JOIN users USING(user_id) WHERE phone = ?", [phone], callback)
}

exports.ofUserAndCode = (data, callback) => {
  global.Db.query("SELECT address_id FROM addresses WHERE code_name = ? AND user_id = ?", data, callback)
}

exports.findByUserAndName = (userId, name, callback) => {
  global.Db.query("SELECT * FROM addresses WHERE user_id = ? AND code_name = ?", [userId, name], callback)
}
