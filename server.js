//Dependencies 
//=================================================
const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();

const PORT = process.env.PORT || 5500;
const mainDir = path.join(__dirname,"/public")

//Handling data parsing
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());


//GET Routes

app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.get('/notes', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(mainDir, "notes.html"));
})

app.get('/api/notes', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname, "/db/db.json"));
})

app.get('/api/notes/:id', (req, res) => {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
})

//POST ROUTE
app.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    console.log("Note saved to db.json. Content: ", newNote);
    res.json(savedNotes);
})
//DELETE ROUTE
app.delete("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`Deleting note with ID ${noteID}`);
    savedNotes = savedNotes.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of savedNotes) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes));
    res.json(savedNotes);
})

//START LISTENING
app.listen(PORT, () => {
    console.log(`Server is listening http://localhost:${PORT}`);
})