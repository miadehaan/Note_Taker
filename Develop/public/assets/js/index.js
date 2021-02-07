const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $editNoteBtn = $(".edit-note");
const $noteList = $(".list-container .list-group");

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

$editNoteBtn.hide(); // hide button unless an existing note is displayed

// A function for getting all notes from the db
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// A function for saving a note to the db
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

// A function for updating a note from the db
const updateNote = (id, note) => {
  return $.ajax({
    url: "api/notes/" + id,
    data: note,
    method: "PUT",
  });
};

// A function for deleting a note from the db
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

// If there is an activeNote, display it, otherwise render empty inputs
const renderActiveNote = () => {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
    $editNoteBtn.show();
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
    $editNoteBtn.hide();
  }
};

// Get the note data from the inputs, save it to the db and update the view
const handleNoteSave = function () {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = function (event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  const note = $(this).parent(".list-group-item").data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the activeNote and displays it
const handleNoteView = function () {
  activeNote = $(this).data();
  // console.log(activeNote);
  renderActiveNote();
};

// Update the clicked note
const handleNoteUpdate = function (event) {
  // change readonly="readonly" to false
  // allows user to edit
  $noteTitle.attr("readonly", false);
  $noteText.attr("readonly", false);
};

// Handle saving the updated note
const handleUpdatedSave = function (event) {
  // get ID from selected, existing note
  activeNoteId = activeNote.id;
  console.log(activeNoteId);

  // collect updated text in textarea
  const updatedNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

  // Pass the new data  
  updateNote(activeNoteId, updatedNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });

  activeNote = {}; // ???

}

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};

// If a note's title or text are empty, hide the save button
// Or else show it
const handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// Render's the list of note titles
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = [];

  // Returns jquery object for li with given text and delete button
  // unless withDeleteButton argument is provided as false
  const create$li = (text, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);

    if (withDeleteButton) {
      const $delBtn = $(
        "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
      );
      $li.append($delBtn);
    }
    return $li;
  }; 

  if (notes.length === 0) {
    noteListItems.push(create$li("No saved Notes", false));
  }

  notes.forEach((note) => {
    const $li = create$li(note.title).data(note);
    noteListItems.push($li);
  });

  $noteList.append(noteListItems);
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => {
  return getNotes().then(renderNoteList);
};

// $saveNoteBtn.on("click", handleNoteSave);
$saveNoteBtn.on("click", function() {
  console.log(activeNote);

  if(activeNote.id) {
    //update existing note
    console.log("note exists");
    handleUpdatedSave();
  }
  else {
    // save new note
    console.log("save NEW note");
    handleNoteSave();
  }
});
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);
$editNoteBtn.on("click", handleNoteUpdate); // add event listener when edit button is clicked on existing note

// Gets and renders the initial list of notes
getAndRenderNotes();
