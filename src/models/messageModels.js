import pool from "../config/db.js";

// Créer un nouveau message
export const createMessageService = async (userId, contenu) => {
    try {
        const query = `
            INSERT INTO messages (user_id, contenu)
            VALUES ($1, $2)
            RETURNING id, user_id, contenu, created_at
        `;
        const result = await pool.query(query, [userId, contenu]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

// Récupérer tous les messages avec les pseudos
export const getAllMessagesService = async () => {
    try {
        const query = `
            SELECT m.id, m.user_id, m.contenu, m.created_at, u.pseudo
            FROM messages m
            JOIN users u ON m.user_id = u.id
            ORDER BY m.created_at ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Récupérer les messages d'un utilisateur
export const getMessagesByUserService = async (userId) => {
    try {
        const query = `
            SELECT m.id, m.user_id, m.contenu, m.created_at, u.pseudo
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.user_id = $1
            ORDER BY m.created_at ASC
        `;
        const result = await pool.query(query, [userId]);
        return result.rows;
    } catch (error) {
        throw error;
    }
};

// Supprimer un message
export const deleteMessageService = async (messageId, userId) => {
    try {
        const query = `
            DELETE FROM messages
            WHERE id = $1 AND user_id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [messageId, userId]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};