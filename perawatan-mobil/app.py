from __future__ import annotations
import sqlite3
from pathlib import Path
from flask import Flask, jsonify, request, send_from_directory, abort

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "records.db"

app = Flask(__name__, static_folder=str(BASE_DIR), static_url_path="")

def init_db() -> None:
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS records (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                plate TEXT NOT NULL,
                type TEXT NOT NULL,
                kilometers INTEGER NOT NULL,
                date TEXT NOT NULL,
                notes TEXT NOT NULL
            )
            """
        )
        conn.commit()

def get_db_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/")
def index() -> object:
    return send_from_directory(BASE_DIR, "index.html")

@app.route("/records", methods=["GET"])
def get_records() -> object:
    with get_db_connection() as conn:
        rows = conn.execute("SELECT * FROM records ORDER BY id DESC").fetchall()
        records = [dict(row) for row in rows]
    return jsonify(records)

@app.route("/records", methods=["POST"])
def add_record() -> object:
    if not request.is_json:
        abort(400, "Request must be JSON.")

    payload = request.get_json()
    required_keys = ["plate", "type", "kilometers", "date", "notes"]
    if not payload or any(key not in payload for key in required_keys):
        abort(400, "Payload missing required fields.")

    with get_db_connection() as conn:
        conn.execute(
            "INSERT INTO records (plate, type, kilometers, date, notes) VALUES (?, ?, ?, ?, ?)",
            (
                payload["plate"].strip(),
                payload["type"].strip(),
                int(payload["kilometers"]),
                payload["date"].strip(),
                payload["notes"].strip(),
            ),
        )
        conn.commit()

    return jsonify({"success": True}), 201

@app.route("/records", methods=["DELETE"])
def clear_records() -> object:
    with get_db_connection() as conn:
        conn.execute("DELETE FROM records")
        conn.commit()
    return jsonify({"success": True})

@app.route("/<path:filename>")
def static_files(filename: str) -> object:
    return send_from_directory(BASE_DIR, filename)

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000)
