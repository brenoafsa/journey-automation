import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col gap-6 bg-white p-8 rounded-lg shadow-md">
        <button
          className="bg-blue-600 text-white py-3 px-6 rounded font-bold text-lg hover:bg-blue-700 transition"
          onClick={() => navigate('/event-create')}
        >
          Criar evento
        </button>
        <button
          className="bg-blue-600 text-white py-3 px-6 rounded font-bold text-lg hover:bg-blue-700 transition"
          onClick={() => navigate('/event-list')}
        >
          Lista de seus eventos
        </button>
        <button
          className="bg-green-600 text-white py-3 px-6 rounded font-bold text-lg hover:bg-green-700 transition"
          onClick={() => navigate('/task-create')}
        >
          Agendar tarefa
        </button>
        <button
          className="bg-green-600 text-white py-3 px-6 rounded font-bold text-lg hover:bg-green-700 transition"
          onClick={() => navigate('/task-list')}
        >
          Lista de suas tarefas
        </button>
      </div>
    </div>
  );
};

export default HomePage;