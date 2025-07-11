import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import pool from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import createUserTable from "./data/createUserTable.js";
import createMessageTable from "./data/createMessageTable.js";

// Pour obtenir __dirname avec ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Servir les fichiers statiques depuis le dossier views
app.use(express.static(path.join(__dirname, '..', 'views')));

// Route pour la page principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// Routes API
app.use("/api", userRoutes);
app.use("/api", messageRoutes);

// Créer les tables si elles n'existent pas
createUserTable();
createMessageTable();

app.listen(port, () => {
    console.log(`🆗 EN ECOUTE DU PORT ${port}`);
    console.log(`🆗 ADRESSE CREER : http://localhost:${port}`);
});

