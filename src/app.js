const { notDeepStrictEqual } = require('assert');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET * returns index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// GET /notes returns notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/notes.html'));
});

// GET /api/notes read db.json and return as JSON
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, '../db/db.json'), (err, data) => {
        res.json(data);
    });
    
});

// POST /api/notes receives note in request body, saves to db.json and returns the note if successful
app.post('/api/notes', (req, res) => {
    const note = req.body;
    let notes;

    fs.readFile(path.join(__dirname, '../db/db.json'), (err, data) => {
        notes = data;
    });

    notes.push(note);

    fs.writeFile(path.join(__dirname, '../db/db.json'), notes, () => {
        res.json(notes);
    })
});

// DELETE /api/notes/:id delete the note by id from db.json

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));