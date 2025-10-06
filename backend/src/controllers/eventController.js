import EventRepository from '../repositories/eventRepository.js';
import UserRepository from '../repositories/userRepository.js';
import { eventSchema, eventUpdateSchema } from '../validation/eventValidation.js';
import { invitationStatusSchema } from '../validation/invitationValidation.js';
import emailQueue from '../services/emailQueue.js';

class EventController {
    async create(req, res, next) {
        try {
            const userId = req.user && req.user.id ? req.user.id : req.user._id;

            const body = {
                ...req.body,
                createdBy: userId,
            };

            const { error, value } = eventSchema.validate(body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const event = await EventRepository.create(value);

            const now = Date.now();
            const sendAt = new Date(event.sendInvitesAt).getTime();
            const delay = Math.max(sendAt - now, 0);

            for (const invite of event.participants) {
                const user = await UserRepository.findById(invite.user);
                if (user) {
                    await emailQueue.add({
                        to: user.email,
                        subject: `Convite para o evento: ${event.title}`,
                        text: value.inviteMessage
                    }, { delay });
                }
            }

            res.status(201).json(event);
        } catch (err) {
            next(err);
        }
    }

    async readAll(req, res, next) {
        try {
            const events = await EventRepository.findAll();
            res.status(200).json(events);
        } catch (err) {
            next(err);
        }
    }

    async readOne(req, res, next) {
        try {
            const { id } = req.params;
            const event = await EventRepository.findById(id);
            if (!event) {
                return res.status(404).json({ error: 'Evento não encontrado' });
            }
            res.status(200).json(event);
        } catch (err) {
            next(err);
        }
    }

    async readByUserId(req, res, next) {
        try {
            const userId = req.user && req.user.id ? req.user.id : req.user._id;

            const events = await EventRepository.findByUserId(userId);

            res.status(200).json(events);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const eventExists = await EventRepository.findById(id);
            if (!eventExists) {
                return res.status(404).json({ error: 'Evento não encontrado' });
            }

            const { error, value } = eventUpdateSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const updatedEvent = await EventRepository.update(id, value);

            res.status(200).json(updatedEvent);
        } catch (err) {
            next(err);
        }
    }

    async respondInvitation(req, res, next) {
        try {
            const { error, value } = invitationStatusSchema.validate({ status: req.body.status });
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { id } = req.params;
            const userId = req.user && req.user.id ? req.user.id : req.user._id;
            const { status } = req.body;

            const event = await EventRepository.findById(id);
            if (!event) {
                return res.status(404).json({ error: 'Evento não encontrado' });
            }

            const participant = await EventRepository.findParticipant(id, userId);
            if (!participant) {
                return res.status(404).json({ error: 'Participante não encontrado neste evento' });
            }

            await EventRepository.updateStatus(id, userId, status);

            if (status === 'accepted' || status === 'declined') {
                const invitedUser = await UserRepository.findById(userId);
                const creator = await UserRepository.findById(event.createdBy);
                if (creator) {
                    await emailQueue.add({
                        to: creator.email,
                        subject: `Resposta ao convite do evento: ${event.title}`,
                        text: `${invitedUser.name} ${status === 'accepted' ? 'aceitou' : 'recusou'} o convite.`
                    });
                }
            }

            res.status(200).json({ message: `Status atualizado para ${value.status}` });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const eventExists = await EventRepository.findById(id);
            if (!eventExists) {
                return res.status(404).json({ error: 'Evento não encontrado' });
            }

            await EventRepository.delete(id);

            res.status(200).json({ message: 'Evento deletado com sucesso' });
        } catch (err) {
            next(err);
        }
    }
}

export default new EventController();