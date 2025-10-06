import Joi from 'joi';

export const taskSchema = Joi.object({
    user: Joi.string().hex().length(24).required(),
    description: Joi.string().required(),
    assignAt: Joi.date().iso().required()
});

export const taskUpdateSchema = Joi.object({
    description: Joi.string().optional(),
});