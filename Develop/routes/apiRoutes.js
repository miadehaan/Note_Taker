var store = require("../db/db"); // stored data

module.exports = function(app) {

    // GET request to handle when user visits a page
    // --------------------------------------------------------------------------------------------
    app.get("/api/notes", function(req, res) {
        store  
            .getNotes()
            .then((notes) => res.json(notes))
            .catch((err) => res.status(500).json(err)); //server error indicates that server encountered an unexpected condition that prevented it from fulfilling the request
    });


    // API POST requests to handle when user submits new notes
    // Should receive a new note to save on the request body, add it to the `db.json` file, 
    // and then return the new note to the client
    // --------------------------------------------------------------------------------------------
    app.post("/api/notes/:id", function(req,res) {
        console.log(req);
        store  
            .saveNote(req.body)
            .then((note) => res.json(note))
            .catch((err) => res.status(500).json(err));
    });

    // DELETE request
    // remove the note with the given `id` property, 
    // and then rewrite the notes to the `db.json` file
    // --------------------------------------------------------------------------------------------
    app.delete("/api/notes/:id", function(req, res) {
        store  
            .deleteNote(req.params.id)
            .then(  () => res.json( {ok: true}  )   )
            .catch((err) => res.status(500).json(err));
    });
};
