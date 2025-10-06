import TaskRepository from '../repositories/taskRepository.js';
import UserRepository from '../repositories/userRepository.js';
import { taskSchema, taskUpdateSchema } from '../validation/taskValidation.js';
import emailQueue from '../services/emailQueue.js';
import taskQueue from '../services/taskQueue.js';

class TaskController {
    async create(req, res, next) {
    try {
        const { error, value } = taskSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const user = await UserRepository.findById(value.user);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        const delay = Math.max(new Date(value.assignAt).getTime() - Date.now(), 0);

        await emailQueue.add({
            to: user.email,
            subject: `Nova tarefa atribuída`,
            text: value.description
        }, { delay });

        await taskQueue.add('assignTask', value, { delay });

        res.status(201).json({ message: 'Task agendada para atribuição e email ao usuário.' });
    } catch (err) {
        next(err);
    }
}

    async readAll(req, res, next) {
        try {
            const tasks = await TaskRepository.findAll();
            res.status(200).json(tasks);
        } catch (err) {
            next(err);
        }
    }

    async readOne(req, res, next) {
        try {
            const { id } = req.params;
            const task = await TaskRepository.findById(id);
            if (!task) {
                return res.status(404).json({ error: 'Task não encontrada' });
            }
            res.status(200).json(task);
        } catch (err) {
            next(err);
        }
    }

    async readByUserId(req, res, next) {
        try {
            const userId = req.user && req.user.id ? req.user.id : req.user._id;
            const tasks = await TaskRepository.findByUserId(userId);
            res.status(200).json(tasks);
        } catch (err) {
            next(err);
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;

            const taskExists = await TaskRepository.findById(id);
            if (!taskExists) {
                return res.status(404).json({ error: 'Task não encontrada' });
            }

            const { error, value } = taskUpdateSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const updatedTask = await TaskRepository.update(id, value);

            res.status(200).json(updatedTask);
        } catch (err) {
            next(err);
        }
    }

    async completeTask(req, res, next) {
        try {
            const { id } = req.params;

            const updatedTask = await TaskRepository.updateStatus(id);
            if (!updatedTask) {
                return res.status(404).json({ error: 'Task não encontrada ou usuário não autorizado' });
            }

            res.status(200).json({ message: 'Task marcada como concluída', task: updatedTask });
        } catch (err) {
            next(err);
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            const taskExists = await TaskRepository.findById(id);
            if (!taskExists) {
                return res.status(404).json({ error: 'Task não encontrada' });
            }

            await TaskRepository.delete(id);

            res.status(200).json({ message: 'Task deletada com sucesso' });
        } catch (err) {
            next(err);
        }
    }
}

export default new TaskController();