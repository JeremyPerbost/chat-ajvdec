import { createUserService, getAllUsersService, getUserByIdService, updateUserService, deleteUserService } from "../models/userModel.js";
import jwt from 'jsonwebtoken';

const handleresponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
}
export const createUser = async (req, res, next) => {
    const { pseudo, password } = req.body;
    try {
        const user = await createUserService(pseudo, password);
        handleresponse(res, 201, "Utilisateur créé avec succès", user);
    } catch (error) {
        next(error);
    }
}
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        handleresponse(res, 200, "Liste des utilisateurs", users);
    } catch (error) {
        next(error);
    }
}
export const getUserById = async (req, res, next) => {
    try {
        const user = await getUserByIdService(req.params.id);
        if (!user) {
            return handleresponse(res, 404, "Utilisateur non trouvé");
        }
        handleresponse(res, 200, "Utilisateur trouvé", user);
    } catch (error) {
        next(error);
    }
}
export const updateUser = async (req, res, next) => {
    const { pseudo, password } = req.body;
    try {
        const user = await updateUserService(req.params.id, pseudo, password);
        if (!user) {
            return handleresponse(res, 404, "Utilisateur non trouvé");
        }
        handleresponse(res, 200, "Utilisateur mis à jour avec succès", user);
    } catch (error) {
        next(error);
    }
}
export const deleteUser = async (req, res, next) => {
    try {
        const user = await deleteUserService(req.params.id);
        if (!user) {
            return handleresponse(res, 404, "Utilisateur non trouvé");
        }
        handleresponse(res, 200, "Utilisateur supprimé avec succès", user);
    } catch (error) {
        next(error);
    }
}
export const loginUser = async (req, res) => {
    const { pseudo, password } = req.body;
    try {
        // Chercher l'utilisateur par pseudo
        const users = await getAllUsersService();
        const user = users.find(u => u.pseudo === pseudo);
        if (!user) {
            return handleresponse(res, 401, "Identifiants invalides");
        }
        if (user.password !== password) {
            return handleresponse(res, 401, "Identifiants invalides");
        }

        // Créer le token JWT
        const token = jwt.sign(
            { 
                userId: user.id, 
                pseudo: user.pseudo 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        handleresponse(res, 200, "Connexion réussie", {
            user: {
                id: user.id,
                pseudo: user.pseudo
            },
            token: token
        });
    } catch (error) {
        next(error);
    }
}

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return handleresponse(res, 401, "Token d'accès requis");
        }

        // Vérifier le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Token valide
        handleresponse(res, 200, "Token valide", {
            userId: decoded.userId,
            pseudo: decoded.pseudo
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return handleresponse(res, 401, "Token expiré");
        } else if (error.name === 'JsonWebTokenError') {
            return handleresponse(res, 401, "Token invalide");
        } else {
            next(error);
        }
    }
}