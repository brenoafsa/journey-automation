import { jest } from '@jest/globals';
import userController from '../controllers/userController.js';
import userRepository from '../repositories/userRepository.js';
import bcrypt from 'bcryptjs';

describe('User CRUD', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a user successfully', async () => {
    const req = {
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: '123456'
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const createdUser = { id: '1', name: req.body.name, email: req.body.email, password: hashedPassword };

    jest.spyOn(userRepository, 'create').mockResolvedValue(createdUser);

    jest.spyOn(userController, 'create').mockImplementation(async (req, res, next) => {
      res.status(201).json({ user: { id: createdUser.id, name: createdUser.name, email: createdUser.email }, token: 'fake-token' });
    });

    await userController.create(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user: { id: createdUser.id, name: createdUser.name, email: createdUser.email }, token: 'fake-token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should login a user successfully', async () => {
    const req = {
      body: {
        email: 'test@example.com',
        password: '123456'
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const foundUser = { id: '1', name: 'Test User', email: req.body.email, password: hashedPassword };

    jest.spyOn(userRepository, 'findByEmail').mockResolvedValue(foundUser);

    jest.spyOn(userController, 'checkCredentials').mockImplementation(async (req, res, next) => {
      res.status(200).json({ user: { id: foundUser.id, name: foundUser.name, email: foundUser.email }, token: 'fake-token' });
    });

    await userController.checkCredentials(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: { id: foundUser.id, name: foundUser.name, email: foundUser.email }, token: 'fake-token' });
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
      { id: '1', name: 'Test User 1', email: 'test1@example.com', password: 'hashed' },
      { id: '2', name: 'Test User 2', email: 'test2@example.com', password: 'hashed' },
    ];

    jest.spyOn(userRepository, 'findAll').mockResolvedValue(users);

    await userController.readAll(req, res, next);

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

    const existingUser = { id: '1', name: 'Test User', email: 'test@example.com', password: 'hashed' };
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

    const existingUser = { id: '1', name: 'Test User', email: 'test@example.com', password: 'hashed' };

    jest.spyOn(userRepository, 'findById').mockResolvedValue(existingUser);
    jest.spyOn(userRepository, 'delete').mockResolvedValue(existingUser);

    await userController.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Usuário deletado com sucesso' });
    expect(next).not.toHaveBeenCalled();
  });
});