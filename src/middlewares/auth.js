import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    const authentification = req.headers['authorization'];
    const token = authentification && authentification.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            status: 401,
            message: 'Token d\'accès requis',
            data: null 
        });
    }

    try {
        const token_decoder = jwt.verify(token, process.env.JWT_SECRET);
        req.user = token_decoder;
        next();
    } catch (error) {
        return res.status(403).json({ 
            status: 403,
            message: 'Token invalide ou expiré',
            data: null 
        });
    }
};
