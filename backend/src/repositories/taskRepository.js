import { Task, User } from '../../database/schema/models.js';

class TaskRepository {
    async create(data) {
        const task = await Task.create(data);
        await User.findByIdAndUpdate(
            data.user,
            { $push: { tasks: task._id } }
        );
        return task;
    }
    
    async findAll() {
        const task = await Task.find();
        return task;
    }

    async findById(id) {
        const task = await Task.findById(id);
        return task;
    }

    async update(id, data) {
        const updatedTask = await Task.findByIdAndUpdate(id, data, { new: true });
        return updatedTask;
    }

    async updateStatus(taskId) {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId },
            { status: 'completed' },
            { new: true }
        );
        return updatedTask;
    }

    async delete(id) {
        const deletedTask = await Task.findByIdAndDelete(id);
        return deletedTask;
    }
}

export default new TaskRepository();