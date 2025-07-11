import pool from "../config/db.js";

const createUserTable = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                pseudo VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            )
        `;
        
        await pool.query(query);
        console.log("✅ Table 'users' créée ou existe déjà");
    } catch (error) {
        console.error("❌ Erreur lors de la création de la table users:", error);
    }
};
export default createUserTable;