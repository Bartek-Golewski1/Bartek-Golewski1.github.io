from flask import Flask, render_template, request, redirect, url_for, g
import sqlite3

app = Flask(__name__)
DATABASE = 'songs.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        db.execute('''
            CREATE TABLE IF NOT EXISTS songs (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                title TEXT NOT NULL, 
                artist TEXT NOT NULL, 
                opinion TEXT
            )
        ''')
        db.commit()

@app.route('/')
def home():
    return redirect(url_for('index'))

@app.route('/songs')
def index():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM songs')
    songs = cursor.fetchall()
    return render_template('index.html', songs=songs)

@app.route('/songs/<int:id>')
def show(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM songs WHERE id = ?', (id,))
    song = cursor.fetchone()
    return render_template('show.html', song=song)

@app.route('/songs/create', methods=('GET', 'POST'))
def create():
    if request.method == 'POST':
        title = request.form['title']
        artist = request.form['artist']
        opinion = request.form['opinion']

        db = get_db()
        db.execute('INSERT INTO songs (title, artist, opinion) VALUES (?, ?, ?)',
                   (title, artist, opinion))
        db.commit()
        return redirect(url_for('index'))
    return render_template('create.html')

@app.route('/songs/<int:id>/edit', methods=('GET', 'POST'))
def edit(id):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM songs WHERE id = ?', (id,))
    song = cursor.fetchone()

    if request.method == 'POST':
        title = request.form['title']
        artist = request.form['artist']
        opinion = request.form['opinion']

        db.execute('UPDATE songs SET title = ?, artist = ?, opinion = ? WHERE id = ?',
                   (title, artist, opinion, id))
        db.commit()
        return redirect(url_for('index'))

    return render_template('edit.html', song=song)

@app.route('/songs/<int:id>/delete', methods=('POST',))
def delete(id):
    db = get_db()
    db.execute('DELETE FROM songs WHERE id = ?', (id,))
    db.commit()
    return redirect(url_for('index'))

if __name__ == '__main__':
    init_db()
    app.run(port=57779, debug=True)