import pool from "../config/db.js";
export const getAllUsersService= async () => {
    const res = await pool.query("SELECT * FROM users");
    return res.rows;
};
export const getUserByIdService = async (id) => {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
};
export const createUserService = async (pseudo, password) => {
    const res = await pool.query("INSERT INTO users (pseudo, password) VALUES ($1, $2) RETURNING *", [pseudo, password]);
    return res.rows[0];
};
export const updateUserService = async (id, pseudo, password) => {
    const res = await pool.query("UPDATE users SET pseudo = $1, password = $2 WHERE id = $3 RETURNING *", [pseudo, password, id]);
    return res.rows[0];
};
export const deleteUserService = async (id) => {
    const res = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return res.rows[0];
};
