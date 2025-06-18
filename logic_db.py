
import sqlite3
import os
from datetime import datetime

DB_NAME = "music_app.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            email TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            account_type TEXT DEFAULT 'user',
            name TEXT,
            favorite_genres TEXT,
            joined_at TEXT
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS playlists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            name TEXT NOT NULL,
            created_at TEXT,
            FOREIGN KEY (user_email) REFERENCES users(email)
        )
    """)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_email TEXT NOT NULL,
            song_name TEXT NOT NULL,
            rating INTEGER,
            comment TEXT,
            created_at TEXT,
            FOREIGN KEY (user_email) REFERENCES users(email)
        )
    """)
    conn.commit()
    conn.close()

class UserManager:
    def __init__(self):
        init_db()

    def register_user(self, email, password, account_type="user", name="", favorite_genres=""):
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            conn.close()
            return False
        joined_at = datetime.now().isoformat()
        cursor.execute("""
            INSERT INTO users (email, password, account_type, name, favorite_genres, joined_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (email, password, account_type, name, favorite_genres, joined_at))
        conn.commit()
        conn.close()
        return True

    def login_user(self, email, password):
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ? AND password = ?", (email, password))
        user = cursor.fetchone()
        conn.close()
        return user is not None

    def create_playlist(self, user_email, playlist_name):
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        created_at = datetime.now().isoformat()
        cursor.execute("""
            INSERT INTO playlists (user_email, name, created_at)
            VALUES (?, ?, ?)
        """, (user_email, playlist_name, created_at))
        conn.commit()
        conn.close()

    def get_playlists(self, user_email):
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM playlists WHERE user_email = ?", (user_email,))
        playlists = [row[0] for row in cursor.fetchall()]
        conn.close()
        return playlists

    def rate_song(self, user_email, song_name, rating, comment):
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        created_at = datetime.now().isoformat()
        cursor.execute("""
            INSERT INTO feedback (user_email, song_name, rating, comment, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (user_email, song_name, rating, comment, created_at))
        conn.commit()
        conn.close()
