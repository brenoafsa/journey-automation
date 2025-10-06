import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.JWT_ACCESS_SECRET;
const EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES;

export const generateAccessToken = (payload) => {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: EXPIRES_IN });
};

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        return null;
    }
};