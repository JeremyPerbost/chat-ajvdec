import express from "express";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser, loginUser } from "../controllers/userController.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

// Routes publiques (sans authentification)
router.post("/user", createUser);           // Inscription
router.post("/user/login", loginUser);      // Connexion

// Route de vérification du token
router.get("/user/verify", authenticateToken, (req, res) => {
    res.json({
        status: 200,
        message: "Token valide",
        data: {
            userId: req.user.userId,
            pseudo: req.user.pseudo
        }
    });
});

// Routes protégées (nécessitent une authentification)
router.get("/users", authenticateToken, getAllUsers);      // Liste des utilisateurs
router.get("/user/:id", authenticateToken, getUserById);   // Utilisateur par ID
router.put("/user/:id", authenticateToken, updateUser);    // Modifier utilisateur
router.delete("/user/:id", authenticateToken, deleteUser); // Supprimer utilisateur

export default router;