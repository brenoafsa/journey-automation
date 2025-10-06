import { verifyAccessToken } from '../services/tokenService.js';

export default function auth(req, res, next) {
    const authHeader = req.headers['Authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyAccessToken(token);
        if (!decoded) {
            return res.status(401).json({ error: 'Token inválido ou expirado' });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}