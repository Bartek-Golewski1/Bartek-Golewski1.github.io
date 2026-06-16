var express = require('express');
var router = express.Router();
const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.resolve(__dirname, '..', 'data.db');
const db = new DatabaseSync(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS songs (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         title TEXT NOT NULL,
                                         artist TEXT NOT NULL,
                                         review TEXT
    )
`);

router.get('/', function(req, res, next) {
    try {
        const statement = db.prepare('SELECT * FROM songs');
        const songs = statement.all();
        res.render('songs/index', { songs: songs });
    } catch (err) {
        next(err);
    }
});

router.get('/create', function(req, res) {
    res.render('songs/create');
});

router.post('/create', function(req, res, next) {
    try {
        const { title, artist, review } = req.body;
        db.prepare('INSERT INTO songs (title, artist, review) VALUES (?, ?, ?)')
            .run(title, artist, review);
        res.redirect('/songs');
    } catch (err) {
        next(err);
    }
});

router.get('/:id', function(req, res, next) {
    try {
        const song = db.prepare('SELECT * FROM songs WHERE id = ?').get(req.params.id);
        if (!song) {
            return res.status(404).send('Nie znaleziono piosenki');
        }
        res.render('songs/show', { song: song });
    } catch (err) {
        next(err);
    }
});

router.get('/:id/edit', function(req, res, next) {
    try {
        const song = db.prepare('SELECT * FROM songs WHERE id = ?').get(req.params.id);
        if (!song) {
            return res.status(404).send('Nie znaleziono piosenki');
        }
        res.render('songs/edit', { song: song });
    } catch (err) {
        next(err);
    }
});

router.post('/:id/edit', function(req, res, next) {
    try {
        const { title, artist, review } = req.body;
        db.prepare('UPDATE songs SET title = ?, artist = ?, review = ? WHERE id = ?')
            .run(title, artist, review, req.params.id);
        res.redirect('/songs/' + req.params.id);
    } catch (err) {
        next(err);
    }
});

router.post('/:id/delete', function(req, res, next) {
    try {
        db.prepare('DELETE FROM songs WHERE id = ?').run(req.params.id);
        res.redirect('/songs');
    } catch (err) {
        next(err);
    }
});

module.exports = router;