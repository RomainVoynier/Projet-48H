const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "app.db");
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Plombier',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
});

app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
  const fullName = String(req.body?.fullName || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const role = String(req.body?.role || "Plombier").trim() || "Plombier";

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Donnees invalides" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Mot de passe trop court (min 6 caracteres)" });
  }

  db.get("SELECT id FROM users WHERE email = ?", [email], async (findErr, row) => {
    if (findErr) {
      return res.status(500).json({ message: "Erreur base de donnees" });
    }

    if (row) {
      return res.status(409).json({ message: "Email deja utilise" });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      db.run(
        "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
        [fullName, email, passwordHash, role],
        function insertCallback(insertErr) {
          if (insertErr) {
            return res.status(500).json({ message: "Impossible de creer le compte" });
          }

          return res.status(201).json({
            id: this.lastID,
            fullName,
            email,
            role,
          });
        }
      );
    } catch (_hashErr) {
      return res.status(500).json({ message: "Erreur technique" });
    }
  });
});

app.post("/api/login", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Identifiants requis" });
  }

  db.get(
    "SELECT id, full_name, email, role, password_hash FROM users WHERE email = ?",
    [email],
    async (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Erreur base de donnees" });
      }

      if (!row) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const isValid = await bcrypt.compare(password, row.password_hash);
      if (!isValid) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      return res.json({
        id: row.id,
        fullName: row.full_name,
        email: row.email,
        role: row.role,
      });
    }
  );
});

app.get("/api/users", (req, res) => {
  const role = String(req.query.role || "").trim();
  const sql = role
    ? "SELECT id, full_name AS fullName, email, role, created_at AS createdAt FROM users WHERE role = ? ORDER BY id DESC"
    : "SELECT id, full_name AS fullName, email, role, created_at AS createdAt FROM users ORDER BY id DESC";
  const params = role ? [role] : [];

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Erreur base de donnees" });
    }
    return res.json(rows);
  });
});

app.use(express.static(path.join(__dirname, "..")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "Web", "connection.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur demarre: http://localhost:${PORT}`);
});