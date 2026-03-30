const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const sqlite3 = require("sqlite3").verbose();
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const SUPABASE_USERS_TABLE = process.env.SUPABASE_USERS_TABLE || "users";
const USE_SUPABASE = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);

const supabase = USE_SUPABASE
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

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
      role TEXT NOT NULL DEFAULT 'Administrateur',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
});

function mapUserRow(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    createdAt: row.created_at,
  };
}

async function registerWithSqlite({ fullName, email, password, role }) {
  return new Promise((resolve, reject) => {
    db.get("SELECT id FROM users WHERE email = ?", [email], async (findErr, row) => {
      if (findErr) {
        reject({ status: 500, message: "Erreur base de donnees" });
        return;
      }

      if (row) {
        reject({ status: 409, message: "Email deja utilise" });
        return;
      }

      try {
        const passwordHash = await bcrypt.hash(password, 10);
        db.run(
          "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)",
          [fullName, email, passwordHash, role],
          function insertCallback(insertErr) {
            if (insertErr) {
              reject({ status: 500, message: "Impossible de creer le compte" });
              return;
            }

            resolve({
              id: this.lastID,
              fullName,
              email,
              role,
            });
          }
        );
      } catch (_hashErr) {
        reject({ status: 500, message: "Erreur technique" });
      }
    });
  });
}

async function registerWithSupabase({ fullName, email, password, role }) {
  const { data: existing, error: findError } = await supabase
    .from(SUPABASE_USERS_TABLE)
    .select("id")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (findError) {
    throw {
      status: 500,
      message:
        findError.code === "42P01"
          ? `Table Supabase introuvable: ${SUPABASE_USERS_TABLE}`
          : "Erreur Supabase (lecture)",
    };
  }

  if (existing) {
    throw { status: 409, message: "Email deja utilise" };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const { data: inserted, error: insertError } = await supabase
    .from(SUPABASE_USERS_TABLE)
    .insert({
      full_name: fullName,
      email,
      password_hash: passwordHash,
      role,
    })
    .select("id, full_name, email, role")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      throw { status: 409, message: "Email deja utilise" };
    }
    throw {
      status: 500,
      message:
        insertError.code === "42P01"
          ? `Table Supabase introuvable: ${SUPABASE_USERS_TABLE}`
          : "Impossible de creer le compte",
    };
  }

  return {
    id: inserted.id,
    fullName: inserted.full_name,
    email: inserted.email,
    role: inserted.role,
  };
}

async function loginWithSqlite({ email, password }) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT id, full_name, email, role, password_hash FROM users WHERE email = ?",
      [email],
      async (err, row) => {
        if (err) {
          reject({ status: 500, message: "Erreur base de donnees" });
          return;
        }

        if (!row) {
          reject({ status: 401, message: "Email ou mot de passe incorrect" });
          return;
        }

        const isValid = await bcrypt.compare(password, row.password_hash);
        if (!isValid) {
          reject({ status: 401, message: "Email ou mot de passe incorrect" });
          return;
        }

        resolve({
          id: row.id,
          fullName: row.full_name,
          email: row.email,
          role: row.role,
        });
      }
    );
  });
}

async function loginWithSupabase({ email, password }) {
  const { data: row, error } = await supabase
    .from(SUPABASE_USERS_TABLE)
    .select("id, full_name, email, role, password_hash")
    .eq("email", email)
    .limit(1)
    .maybeSingle();

  if (error) {
    throw {
      status: 500,
      message:
        error.code === "42P01"
          ? `Table Supabase introuvable: ${SUPABASE_USERS_TABLE}`
          : "Erreur Supabase (lecture)",
    };
  }

  if (!row) {
    throw { status: 401, message: "Email ou mot de passe incorrect" };
  }

  const isValid = await bcrypt.compare(password, row.password_hash);
  if (!isValid) {
    throw { status: 401, message: "Email ou mot de passe incorrect" };
  }

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
  };
}

async function listUsersWithSqlite(role) {
  const sql = role
    ? "SELECT id, full_name, email, role, created_at FROM users WHERE role = ? ORDER BY id DESC"
    : "SELECT id, full_name, email, role, created_at FROM users ORDER BY id DESC";
  const params = role ? [role] : [];

  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject({ status: 500, message: "Erreur base de donnees" });
        return;
      }
      resolve(rows.map(mapUserRow));
    });
  });
}

async function listUsersWithSupabase(role) {
  let query = supabase
    .from(SUPABASE_USERS_TABLE)
    .select("id, full_name, email, role, created_at")
    .order("created_at", { ascending: false });

  if (role) {
    query = query.eq("role", role);
  }

  const { data, error } = await query;
  if (error) {
    throw {
      status: 500,
      message:
        error.code === "42P01"
          ? `Table Supabase introuvable: ${SUPABASE_USERS_TABLE}`
          : "Erreur Supabase (lecture)",
    };
  }

  return (data || []).map(mapUserRow);
}

app.use(cors());
app.use(express.json());

app.post("/api/register", async (req, res) => {
  const fullName = String(req.body?.fullName || "").trim();
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const role = String(req.body?.role || "Administrateur").trim() || "Administrateur";

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Donnees invalides" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Mot de passe trop court (min 6 caracteres)" });
  }

  try {
    const createdUser = USE_SUPABASE
      ? await registerWithSupabase({ fullName, email, password, role })
      : await registerWithSqlite({ fullName, email, password, role });

    return res.status(201).json(createdUser);
  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Erreur technique" });
  }
});

app.post("/api/login", (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  if (!email || !password) {
    return res.status(400).json({ message: "Identifiants requis" });
  }

  (async () => {
    try {
      const user = USE_SUPABASE
        ? await loginWithSupabase({ email, password })
        : await loginWithSqlite({ email, password });
      return res.json(user);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Erreur technique" });
    }
  })();
});

app.get("/api/users", (req, res) => {
  const role = String(req.query.role || "").trim();
  (async () => {
    try {
      const users = USE_SUPABASE
        ? await listUsersWithSupabase(role)
        : await listUsersWithSqlite(role);
      return res.json(users);
    } catch (error) {
      return res
        .status(error.status || 500)
        .json({ message: error.message || "Erreur technique" });
    }
  })();
});

app.use(express.static(path.join(__dirname, "..")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "Web", "connection.html"));
});

app.listen(PORT, () => {
  console.log(
    USE_SUPABASE
      ? `Stockage actif: Supabase (table: ${SUPABASE_USERS_TABLE})`
      : "Stockage actif: SQLite local"
  );
  console.log(`Serveur demarre: http://localhost:${PORT}`);
});