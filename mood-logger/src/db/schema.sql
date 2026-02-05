CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    raw_text TEXT NOT NULL,
    input_type TEXT NOT NULL DEFAULT 'text',
    sentiment TEXT,
    mood_summary TEXT,
    insights TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);