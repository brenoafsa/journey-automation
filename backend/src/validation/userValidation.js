import Joi from 'joi';

export const userSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required()
});

export const userUpdateSchema = Joi.object({
    name: Joi.string().optional(),
    email: Joi.string().email().optional()
});