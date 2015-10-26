const bodyParser = require("body-parser")
const express = require("express")
const path = require("path")
const publicPath = path.join(__dirname, "../public")

module.exports = app => {
  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(express.static(publicPath))
}
