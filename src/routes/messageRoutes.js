import express from "express";
import { createMessage, getAllMessages, getMessagesByUser, deleteMessage } from "../controllers/messageController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// Routes protégées - nécessitent une authentification
router.post("/message", authenticateToken, createMessage);
router.get("/messages", authenticateToken, getAllMessages);
router.get("/messages/user/:userId", authenticateToken, getMessagesByUser);
router.delete("/message/:id", authenticateToken, deleteMessage);

export default router;