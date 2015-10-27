// todo need to start the DB beforehand; npm start will do this.
module.exports = () => {
  return {
    files: [
      "server/**/*.js"
    ],
    tests: [
      "tests/**/*.test.js"
    ],
    env: {
      type: "node",
      params: {
        runner: "--harmony --harmony_arrow_functions"
      }
    },
    debug: true
  }
}
