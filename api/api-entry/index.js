const createHandler = require("azure-function-express").createHandler;

const app = require("../dist/app.js"); 

module.exports = createHandler(app.default || app);