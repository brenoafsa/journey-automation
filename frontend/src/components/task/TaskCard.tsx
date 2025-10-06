import React from 'react';
import { TaskResponse } from '../../services/taskService';

interface TaskCardProps {
  task: TaskResponse;
  onComplete?: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  const cardColor =
    task.status === 'completed'
      ? 'bg-green-100 border-green-400'
      : 'bg-yellow-100 border-yellow-400';

  return (
    <div className={`relative border-l-4 ${cardColor} shadow rounded p-4 mb-4 flex items-center`}>
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{task.description}</h3>
        <div className="text-sm text-gray-600">
          Data de atribuição: {new Date(task.assignAt).toLocaleString()}
        </div>
        <div className="mt-2 text-xs font-bold uppercase">
          Status: {task.status === 'completed' ? 'Concluída' : 'Pendente'}
        </div>
      </div>
      {task.status !== 'completed' && onComplete && (
        <button
          className="ml-4 p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition"
          title="Marcar como concluída"
          onClick={() => onComplete(task._id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default TaskCard;