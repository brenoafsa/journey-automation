import Joi from 'joi';

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

export const userUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});