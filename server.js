// Setup dependencies
var express = require("express");
var path = require("path");

// add 'uuid' library to create new, unique id's for each task
var uuid = require("uuid");

var app = express();

// Initialize port 
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Send static files for html
app.use(express.static("./Develop/public"));

// Set up Routes
require("./Develop/routes/htmlRoutes")(app);
require("./Develop/routes/apiRoutes")(app);

// Listener - "start" the server
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});