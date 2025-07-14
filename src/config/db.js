import pkg from "pg";//importation du module postgree
import dotenv from "dotenv";
const Pool = pkg.Pool; //importation de la classe Pool du module pg
dotenv.config();

//db.js est un gestionnaire de connexion à la base de données PostgreSQL
// Il utilise le module pg pour créer un pool de connexions
// et se connecte à la base de données en utilisant les variables d'environnement

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on("connect", () => {
    console.log("🆗 POOL DE CONNEXION À LA BASE DE DONNÉES CRÉÉ");
});

export default pool;