import { jest } from '@jest/globals';
import userController from '../controllers/userController.js';
import userRepository from '../repositories/userRepository.js';

describe('User CRUD', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a user successfully', async () => {
    const req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const createdUser = { id: '1', ...req.body };

    jest.spyOn(userRepository, 'create').mockResolvedValue(createdUser);

    await userController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(createdUser);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return all users', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const users = [
      { id: '1', name: 'Test User 1', email: 'test1@example.com' },
      { id: '2', name: 'Test User 2', email: 'test2@example.com' },
    ];

    jest.spyOn(userRepository, 'findAll').mockResolvedValue(users);

    await userController.readAllUsers(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
    expect(next).not.toHaveBeenCalled();
  });

  it('should update a user successfully', async () => {
    const req = {
      params: { id: '1' },
      body: { name: 'Updated User Name' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const existingUser = { id: '1', name: 'Test User', email: 'test@example.com' };
    const updatedUser = { ...existingUser, ...req.body };

    jest.spyOn(userRepository, 'findById').mockResolvedValue(existingUser);
    jest.spyOn(userRepository, 'update').mockResolvedValue(updatedUser);

    await userController.update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedUser);
    expect(next).not.toHaveBeenCalled();
  });

  it('should delete a user successfully', async () => {
    const req = {
      params: { id: '1' },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const existingUser = { id: '1', name: 'Test User', email: 'test@example.com' };

    jest.spyOn(userRepository, 'findById').mockResolvedValue(existingUser);
    jest.spyOn(userRepository, 'delete').mockResolvedValue(existingUser);

    await userController.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário deletado com sucesso' });
    expect(next).not.toHaveBeenCalled();
  });
});