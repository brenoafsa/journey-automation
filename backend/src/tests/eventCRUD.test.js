import { jest } from '@jest/globals';
import eventController from '../controllers/eventController.js';
import eventRepository from '../repositories/eventRepository.js';

describe('Event CRUD', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // it('should create an event and schedule emails for participants', ...)

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

  // it('should respond to an invitation and notify the creator', ...)
});