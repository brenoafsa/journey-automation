import Joi from 'joi';

export const invitationStatusSchema = Joi.object({
    status: Joi.string().valid('accepted', 'declined').required(),
    userId: Joi.string().hex().length(24).required()
});