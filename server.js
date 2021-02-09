//Dependencies 
//=================================================
const express = require('express');
const path = require('path');
const fs = require('fs');


const app = express();

const PORT = process.env.PORT || 5500;

//Handling data parsing
app.use(express.urlencoded({extended:true}))
app.use(express.json());


//Routes
app.get('/', (req, res) => {
    console.log(req.url);
    res.sendFile(path.join(__dirname + "/public/index.html"))
})

app.get('/notes', (req, res) => {
    console.log(req.url);
   res.sendFile(path.join(__dirname + "/public/notes.html"))
})


app.post('/api/notes', (req, res) => {
    let newNote = req.body;
    let obj;
    fs.readFile(path.join(__dirname, '/db/db.json'), {encoding: 'utf-8'}, function (error, data) {
        if (error) return console.error(error)
        obj = JSON.parse(data.string)
        console.log(`Obj is ${obj}`)
    })
    // let notes = JSON.stringify(newNote)
    fs.writeFile('./db/db.json', JSON.stringify(newNote), (err) => {
        if (err) {
            console.error(err)
        } else {
            console.log('Written to file successfully');
        }
    })
    res.json(obj);
})

app.get('/api/notes', (req, res) => {
    console.log(req.url);
    return res.json(dbNotes)
})

app.get('/api/notes/:note', (req, res) => {
    let chosen = req.params.note;
    console.log(chosen);

    for (let i = 0; i < dbNotes.length; i++){
        if (chosen === dbNotes[i].title) {
            return res.json(dbNotes[i])
        }
    }
    return res.json(false);
})
app.listen(PORT, () => {
    console.log(`Server is listening http://localhost:${PORT}`);
})