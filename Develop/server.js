// Setup dependencies
var express = require("express");
var path = require("path");

var app = express();

// Initialize port
var PORT = process.env.PORT || 3001;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up Routes
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../Develop/public/index.html"));
});

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "../Develop/notes.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "../Develop/public/index.html"));
});

// Listener - "start" the server
app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});