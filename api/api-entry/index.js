const createHandler = require("azure-function-express").createHandler;
const app = require("../dist/src/app.js");

module.exports = createHandler(app.default || app);