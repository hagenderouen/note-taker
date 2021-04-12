const { notDeepStrictEqual } = require('assert');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// GET /notes returns notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

// GET /api/notes read db.json and return as JSON
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), 'utf8', (err, data) => {
        res.json(JSON.parse(data));
    });
    
});

// POST /api/notes receives note in request body, saves to db.json and returns the note if successful
app.post('/api/notes', (req, res) => {
    const note = req.body;
    note.id = uuidv4();

    fs.readFile(path.join(__dirname, '../db/db.json'), (err, data) => {
        notes = JSON.parse(data);
        notes.push(note);
        notesJson = JSON.stringify(notes);

        fs.writeFile(path.join(__dirname, '../db/db.json'), notesJson, () => {
            res.json(notesJson);
        });

    });
});

// DELETE /api/notes/:id delete the note by id from db.json
app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(path.join(__dirname, '../db/db.json'), (err, data) => {
        const notes = JSON.parse(data);
        const modNotes = notes.filter(note => note.id !== id);
        const modNotesJson = JSON.stringify(modNotes)

        fs.writeFile(path.join(__dirname, '../db/db.json'), modNotesJson, (err) => {
            if (err) throw err;
            res.json(modNotesJson);
        });

    }); 

});

// GET * returns index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));