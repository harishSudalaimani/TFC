CREATE TABLE IF NOT EXISTS registrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  size TEXT NOT NULL CHECK (size IN ('S','M','L','XL','XXL')),
  jersey_number INTEGER NOT NULL CHECK (jersey_number BETWEEN 0 AND 99),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
