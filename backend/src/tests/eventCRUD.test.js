import { jest } from '@jest/globals';
import eventController from '../controllers/eventController.js';
import eventRepository from '../repositories/eventRepository.js';
import userRepository from '../repositories/userRepository.js';
import emailQueue from '../services/emailQueue.js';

describe('Event CRUD', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an event and schedule emails for participants', async () => {
    const req = {
      body: {
        title: 'Evento Teste',
        description: 'Descrição',
        location: 'Local',
        date: new Date(Date.now() + 3600000).toISOString(),
        sendInvitesAt: new Date(Date.now() + 1).toISOString(),
        createdBy: '507f1f77bcf86cd799439011',
        inviteMessage: 'Você está convidado!',
        participants: [
          { user: '507f1f77bcf86cd799439012' },
          { user: '507f1f77bcf86cd799439013' }
        ]
      }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const createdEvent = { ...req.body, _id: 'eventid', participants: req.body.participants };

    jest.spyOn(eventRepository, 'create').mockResolvedValue(createdEvent);
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce({ email: 'user1@email.com' })
      .mockResolvedValueOnce({ email: 'user2@email.com' });
    jest.spyOn(emailQueue, 'add').mockResolvedValue();

    const expectedCreateArg = {
      ...req.body,
      date: new Date(req.body.date),
      sendInvitesAt: new Date(req.body.sendInvitesAt),
    };

    await eventController.create(req, res, next);

    expect(eventRepository.create).toHaveBeenCalledWith(expectedCreateArg);
    expect(emailQueue.add).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdEvent);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return all events', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const events = [{ title: 'Evento 1' }, { title: 'Evento 2' }];
    jest.spyOn(eventRepository, 'findAll').mockResolvedValue(events);

    await eventController.readAll(req, res, next);

    expect(eventRepository.findAll).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(events);
    expect(next).not.toHaveBeenCalled();
  });

  it('should update an event', async () => {
    const req = {
      params: { id: 'eventid' },
      body: { title: 'Novo Título' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(eventRepository, 'findById').mockResolvedValue({ _id: 'eventid' });
    jest.spyOn(eventRepository, 'update').mockResolvedValue({ _id: 'eventid', title: 'Novo Título' });

    await eventController.update(req, res, next);

    expect(eventRepository.update).toHaveBeenCalledWith('eventid', { title: 'Novo Título' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ _id: 'eventid', title: 'Novo Título' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should delete an event', async () => {
    const req = {
      params: { id: 'eventid' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jest.spyOn(eventRepository, 'findById').mockResolvedValue({ _id: 'eventid' });
    jest.spyOn(eventRepository, 'delete').mockResolvedValue({ _id: 'eventid' });

    await eventController.delete(req, res, next);

    expect(eventRepository.delete).toHaveBeenCalledWith('eventid');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Evento deletado com sucesso' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should respond to an invitation and notify the creator', async () => {
    const req = {
      params: { eventId: 'eventid' },
      body: { userId: '507f1f77bcf86cd799439012', status: 'accepted' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const event = {
      _id: 'eventid',
      title: 'Evento Teste',
      createdBy: '507f1f77bcf86cd799439011',
      participants: [{ user: '507f1f77bcf86cd799439012', status: 'invited' }]
    };

    jest.spyOn(eventRepository, 'findById').mockResolvedValue(event);
    jest.spyOn(eventRepository, 'findParticipant').mockReturnValue(event.participants[0]);
    jest.spyOn(eventRepository, 'updateStatus').mockResolvedValue({});
    jest.spyOn(userRepository, 'findById')
      .mockResolvedValueOnce({ name: 'Participante', email: 'participante@email.com' })
      .mockResolvedValueOnce({ name: 'Criador', email: 'criador@email.com' });
    jest.spyOn(emailQueue, 'add').mockResolvedValue();

    await eventController.respondInvitation(req, res, next);

    expect(eventRepository.updateStatus).toHaveBeenCalledWith('eventid', '507f1f77bcf86cd799439012', 'accepted');
    expect(emailQueue.add).toHaveBeenCalledWith({
      to: 'criador@email.com',
      subject: `Resposta ao convite do evento: Evento Teste`,
      text: `Participante aceitou o convite.`
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Status atualizado para accepted' });
    expect(next).not.toHaveBeenCalled();
  });
});