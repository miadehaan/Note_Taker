var allNotes = require("../db/db"); // stored data in db.json file
const fs = require("fs");
const { v4: uuidv4 } = require('uuid'); // add 'uuid' library to create new, unique id's for each task

module.exports = function(app) {

    // GET request to handle when user visits a page (Notes)
    // --------------------------------------------------------------------------------------------
    app.get("/api/notes", function(req, res) {
        // Get all notes from db
        res.json(allNotes);
    });

    // API POST  - to create a new note
    // Should receive a new note to save on the request body, add it to the `db.json` file, 
    // and then return the new note to the client
    // --------------------------------------------------------------------------------------------
    app.post("/api/notes", function(req, res) {

        // Get new note add unique id
        let addNote = req.body; // takes the request/input
        addNote.id = uuidv4();
        allNotes.push(addNote);

        // Add note to db file
        fs.writeFile("./Develop/db/db.json", JSON.stringify(allNotes), "utf8", (err) => {
                if (err) throw err;
                res.json(allNotes);
            }
        );
    });

    // DELETE a note
    // remove the note with the given `id` property, 
    // and then rewrite the notes to the `db.json` file
    // --------------------------------------------------------------------------------------------
    app.delete("/api/notes/:id", function(req, res) {
        
        allNotes = allNotes.filter(note=> {
            if (note.id == req.params.id) {
                return false;
            };
            return true;
        });
            
        // Remove note from db file
        fs.writeFile("./Develop/db/db.json", JSON.stringify(allNotes), "utf8", (err) => {
                if (err) throw err;
                res.json(allNotes);
            }
        );

        res.send(allNotes);
    });

};
