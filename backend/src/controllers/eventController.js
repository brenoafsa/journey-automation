import EventRepository from '../repositories/eventRepository.js';
import { eventSchema, eventUpdateSchema } from '../validation/eventValidation.js';
import { invitationStatusSchema } from '../validation/invitationValidation.js';

class EventController {
    async create(req, res, next) {
        try {
            const { error, value } = eventSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const event = await EventRepository.create(value);

            /* for (const invite of event.participants) {
                const user = await UserRepository.findById(invite.user);
                if (user) {
                    await emailQueue.add('send-invite', {
                        to: user.email,
                        eventName: event.title,
                        message: participant.inviteMessage
                    });
                }
            }
            
            // Agendar o lembrete do evento
            const reminderDate = new Date(event.date);
            reminderDate.setDate(reminderDate.getDate() - 1);
            const delay = reminderDate.getTime() - Date.now();

            if (delay > 0) {
                await emailQueue.add('send-reminder', { eventId: event._id }, { delay });
            } */

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
            const { error, value } = invitationStatusSchema.validate(req.body);
             if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { eventId } = req.params;
            const { userId, status } = req.body;

            const event = await EventRepository.findById(eventId);
            if (!event) {
                return res.status(404).json({ error: 'Evento não encontrado' });
            }

            const participant = EventRepository.findParticipant(eventId, userId);
            if (!participant) {
                return res.status(404).json({ error: 'Participante não encontrado neste evento' });
            }

            await EventRepository.updateStatus(eventId, userId, status);

            /* Se aceitou, notificar o criador do evento
            if (value.status === 'accepted' && event.createdBy) {
                 const invitedUser = await User.findById(userId);
                 await emailQueue.add('send-acceptance-notification', {
                    to: event.createdBy.email,
                    eventName: event.title,
                    participantName: invitedUser ? invitedUser.name : 'Um convidado'
                });
            } */

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