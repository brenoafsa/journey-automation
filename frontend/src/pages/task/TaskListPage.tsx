import React, { useEffect, useState } from 'react';
import { taskService, TaskResponse } from '../../services/taskService';
import TaskCard from '../../components/task/TaskCard';

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => {
    setLoading(true);
    taskService.getAllByUserId()
      .then(setTasks)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = async (id: string) => {
    await taskService.completeTask(id);
    fetchTasks();
  };

  if (loading) return <div>Carregando tarefas...</div>;

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Minhas Tarefas</h2>
      <div className="w-full max-w-2xl">
        {tasks.length === 0 && <div>Nenhuma tarefa encontrada.</div>}
        {tasks.map(task => (
          <TaskCard key={task._id} task={task} onComplete={handleComplete} />
        ))}
      </div>
    </div>
  );
};

export default TaskListPage;