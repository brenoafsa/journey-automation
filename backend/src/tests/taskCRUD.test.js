import { jest } from '@jest/globals';
import taskController from '../controllers/taskController.js';
import taskRepository from '../repositories/taskRepository.js';

describe('Task CRUD', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  // it('should create a task and schedule email and queue', ...)

  it('should return all tasks', async () => {
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const tasks = [
      { id: '1', description: 'Task 1' },
      { id: '2', description: 'Task 2' }
    ];

    jest.spyOn(taskRepository, 'findAll').mockResolvedValue(tasks);

    await taskController.readAll(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tasks);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return a task by id', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439012' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const task = { id: '507f1f77bcf86cd799439012', description: 'Task 1' };

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(task);

    await taskController.readOne(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(task);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if task not found by id', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439012' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(null);

    await taskController.readOne(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Task não encontrada' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return tasks by user id', async () => {
    const req = { user: { id: '507f1f77bcf86cd799439012345678' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const tasks = [{ id: '1', user: '507f1f77bcf86cd799439012345678' }];

    jest.spyOn(taskRepository, 'findByUserId').mockResolvedValue(tasks);

    await taskController.readByUserId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(tasks);
    expect(next).not.toHaveBeenCalled();
  });

  it('should update a task', async () => {
    const req = {
      params: { id: '507f1f77bcf86cd799439012' },
      body: { description: 'Updated Task' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const existingTask = { id: '507f1f77bcf86cd799439012', description: 'Task 1' };
    const updatedTask = { id: '507f1f77bcf86cd799439012', description: 'Updated Task' };

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(existingTask);
    jest.spyOn(taskRepository, 'update').mockResolvedValue(updatedTask);

    await taskController.update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(updatedTask);
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if task not found on update', async () => {
    const req = {
      params: { id: '507f1f77bcf86cd799439012' },
      body: { description: 'Updated Task' }
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(null);

    await taskController.update(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Task não encontrada' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should complete a task', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439012' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const updatedTask = { id: '507f1f77bcf86cd799439012', status: 'completed' };

    jest.spyOn(taskRepository, 'updateStatus').mockResolvedValue(updatedTask);

    await taskController.completeTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task marcada como concluída', task: updatedTask });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if task not found on complete', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439012' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    jest.spyOn(taskRepository, 'updateStatus').mockResolvedValue(null);

    await taskController.completeTask(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Task não encontrada ou usuário não autorizado' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should delete a task', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439012' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    const existingTask = { id: '507f1f77bcf86cd799439012', description: 'Task 1' };

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(existingTask);
    jest.spyOn(taskRepository, 'delete').mockResolvedValue(existingTask);

    await taskController.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Task deletada com sucesso' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 404 if task not found on delete', async () => {
    const req = { params: { id: '507f1f77bcf86cd799439012' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    jest.spyOn(taskRepository, 'findById').mockResolvedValue(null);

    await taskController.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'Task não encontrada' });
    expect(next).not.toHaveBeenCalled();
  });
});