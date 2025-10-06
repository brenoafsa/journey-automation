import Bull from 'bull';
import TaskRepository from '../repositories/taskRepository.js';

const taskQueue = new Bull('task', {
  redis: { host: 'redis', port: 6379 }
});

taskQueue.process('assignTask', async (job) => {
  const { user, description, assignAt } = job.data;
  await TaskRepository.create({
    user,
    description,
    assignAt,
    status: 'pending'
  });
});

export default taskQueue;