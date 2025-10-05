import { jest } from '@jest/globals';
import eventController from '../controllers/eventController.js';
import eventRepository from '../repositories/eventRepository.js';

describe('Event CRUD', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create an event successfully', async () => {
    const req = {
      body: {
        title: 'New Event',
        description: 'Event Description',
        location: 'Event Location',
        date: new Date().toISOString(),
        createdBy: '60d5ecb3b3e3f1a3c8a6d123',
        inviteMessage: 'You are invited!',
        participants: [{ user: '60d5ecb3b3e3f1a3c8a6d124' }],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const createdEvent = { _id: '1', ...req.body };

    jest.spyOn(eventRepository, 'create').mockResolvedValue(createdEvent);

    await eventController.create(req, res, next);

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

    const events = [
      { id: '1', title: 'Event 1' },
      { id: '2', title: 'Event 2' },
    ];

    jest.spyOn(eventRepository, 'findAll').mockResolvedValue(events);

    await eventController.readAll(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(events);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a single event', async () => {
    const req = { params: { id: '1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const event = { id: '1', title: 'Test Event' };

    jest.spyOn(eventRepository, 'findById').mockResolvedValue(event);

    await eventController.readOne(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(event);
    expect(next).not.toHaveBeenCalled();
  });

  it('should update an event successfully', async () => {
    const req = {
      params: { id: '1' },
      body: { title: 'Updated Event Title' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const existingEvent = { id: '1', title: 'Original Title' };
    const updatedEvent = { ...existingEvent, ...req.body };

    jest.spyOn(eventRepository, 'findById').mockResolvedValue(existingEvent);
    jest.spyOn(eventRepository, 'update').mockResolvedValue(updatedEvent);

    await eventController.update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedEvent);
    expect(next).not.toHaveBeenCalled();
  });

  it('should delete an event successfully', async () => {
    const req = {
      params: { id: '1' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const existingEvent = { id: '1', title: 'Test Event' };

    jest.spyOn(eventRepository, 'findById').mockResolvedValue(existingEvent);
    jest.spyOn(eventRepository, 'delete').mockResolvedValue(existingEvent);

    await eventController.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Evento deletado com sucesso' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should respond to an invitation', async () => {
    const req = {
        params: { eventId: '1' },
        body: { userId: '60d5ecb3b3e3f1a3c8a6d124', status: 'accepted' }
    };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();

    const event = { _id: '1', participants: [{ user: '60d5ecb3b3e3f1a3c8a6d124', status: 'invited' }] };
    
    jest.spyOn(eventRepository, 'findById').mockResolvedValue(event);
    jest.spyOn(eventRepository, 'findParticipant').mockResolvedValue(event.participants[0]);
    jest.spyOn(eventRepository, 'updateStatus').mockResolvedValue({ nModified: 1 });

    await eventController.respondInvitation(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Status atualizado para accepted' });
    expect(next).not.toHaveBeenCalled();
  });
});