import pool from "../config/db.js";

export default async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            contenu TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        )
    `).then(() => console.log("✅ Table messages OK"))
      .catch(err => console.error("❌ Erreur messages:", err.message));
};