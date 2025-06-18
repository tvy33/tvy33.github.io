
from flask import Flask, request, send_from_directory, redirect, session
import os
from logic_db import UserManager

app = Flask(__name__)
app.secret_key = "vdcl_music_secret"

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_FOLDER = os.path.join(BASE_DIR, "tvy33.github.io-main")
user_manager = UserManager()

@app.route("/")
def index():
    return send_from_directory(FRONTEND_FOLDER, "index.html")

@app.route("/<path:filename>")
def serve_static(filename):
    return send_from_directory(FRONTEND_FOLDER, filename)

@app.route("/register", methods=["POST"])
def register():
    email = request.form.get("email")
    password = request.form.get("password")
    account_type = "user"
    name = ""
    favorite_genres = ""
    if user_manager.register_user(email, password, account_type, name, favorite_genres):
        return redirect("/login.html")
    return redirect("/signup.html")

@app.route("/login", methods=["POST"])
def login():
    email = request.form.get("email")
    password = request.form.get("password")
    if user_manager.login_user(email, password):
        session["email"] = email
        return redirect("/home.html")
    return redirect("/login.html")

@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login.html")

@app.route("/playlist", methods=["GET", "POST"])
def playlist():
    if "email" not in session:
        return redirect("/login.html")
    if request.method == "POST":
        name = request.form.get("playlist_name")
        if name:
            user_manager.create_playlist(session["email"], name)
        return redirect("/playlist.html")
    return send_from_directory(FRONTEND_FOLDER, "playlist.html")

@app.route("/rate_song", methods=["POST"])
def rate_song():
    if "email" not in session:
        return redirect("/login.html")
    song = request.form.get("song_name")
    rating = int(request.form.get("rating", 0))
    comment = request.form.get("comment", "")
    if song and 1 <= rating <= 5:
        user_manager.rate_song(session["email"], song, rating, comment)
    return redirect("/home.html")

if __name__ == "__main__":
    app.run(debug=True)
