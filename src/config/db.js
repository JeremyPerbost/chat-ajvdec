import pkg from "pg";//importation du module postgree
import dotenv from "dotenv";
const Pool = pkg.Pool; //importation de la classe Pool du module pg
dotenv.config();
//db.js est un gestionnaire de connexion à la base de données PostgreSQL
// Il utilise le module pg pour créer un pool de connexions
// et se connecte à la base de données en utilisant les variables d'environnement
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});
pool.on("connect", () => {
    console.log("🆗 POOL DE CONNEXION À LA BASE DE DONNÉES CRÉÉ");
    //console.log(pool);
});
export default pool;