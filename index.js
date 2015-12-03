const log = require("./server/config/log.js")
const app = require("./server/server.js")

const portNumber = 6060
const port = process.env.PORT || portNumber
const host = process.env.HOST || "0.0.0.0"

log.info(`Server listening at ${host}:${port}…`)
app.listen(port)
