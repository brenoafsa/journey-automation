import Joi from 'joi';

const participantSchema = Joi.object({
    user: Joi.string().hex().length(24).required(),
});

export const eventSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    date: Joi.date().iso().required(),
    createdBy: Joi.string().hex().length(24).required(),
    inviteMessage: Joi.string().required(),
    participants: Joi.array().items(participantSchema).min(1).required()
});

export const eventUpdateSchema = Joi.object({
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    location: Joi.string().optional(),
});