import { createMessageService, getAllMessagesService, getMessagesByUserService, deleteMessageService } from "../models/messageModel.js";

const handleresponse = (res, status, message, data = null) => {
    res.status(status).json({
        status,
        message,
        data
    });
};

// Créer un nouveau message
export const createMessage = async (req, res, next) => {
    try {
        const { contenu } = req.body;
        const userId = req.user.userId; // Récupéré du token JWT via le middleware

        if (!contenu || contenu.trim() === '') {
            return handleresponse(res, 400, "Le contenu du message est requis");
        }

        if (contenu.length > 1000) {
            return handleresponse(res, 400, "Le message ne peut pas dépasser 1000 caractères");
        }

        const message = await createMessageService(userId, contenu.trim());
        handleresponse(res, 201, "Message créé avec succès", message);
    } catch (error) {
        next(error);
    }
};

// Récupérer tous les messages
export const getAllMessages = async (req, res, next) => {
    try {
        const messages = await getAllMessagesService();
        handleresponse(res, 200, "Messages récupérés avec succès", messages);
    } catch (error) {
        next(error);
    }
};

// Récupérer les messages d'un utilisateur
export const getMessagesByUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const messages = await getMessagesByUserService(userId);
        handleresponse(res, 200, "Messages de l'utilisateur récupérés avec succès", messages);
    } catch (error) {
        next(error);
    }
};

// Supprimer un message
export const deleteMessage = async (req, res, next) => {
    try {
        const messageId = req.params.id;
        const userId = req.user.userId; // Seul l'auteur peut supprimer son message

        const deletedMessage = await deleteMessageService(messageId, userId);
        
        if (!deletedMessage) {
            return handleresponse(res, 404, "Message non trouvé ou vous n'êtes pas autorisé à le supprimer");
        }

        handleresponse(res, 200, "Message supprimé avec succès", deletedMessage);
    } catch (error) {
        next(error);
    }
};