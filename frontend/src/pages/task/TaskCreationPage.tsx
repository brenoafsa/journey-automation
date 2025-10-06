import React, { useEffect, useState } from 'react';
import { userService, User } from '../../services/userService';
import { taskService, TaskCreateRequest } from '../../services/taskService';

const TaskCreation: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({
    user: '',
    description: '',
    assignAt: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    userService.getAll()
      .then(setUsers)
      .catch(() => setError('Erro ao carregar usuários'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const taskData: TaskCreateRequest = {
        user: form.user,
        description: form.description,
        assignAt: new Date(form.assignAt).toISOString(),
      };
      await taskService.create(taskData);
      setSuccess('Tarefa criada com sucesso!');
      setForm({
        user: '',
        description: '',
        assignAt: '',
      });
    } catch {
      setError('Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md min-w-[320px] flex flex-col gap-4 w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4">Criar Tarefa</h2>
        <label className="font-semibold">Usuário</label>
        <select
          name="user"
          value={form.user}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Selecione um usuário</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <label className="font-semibold">Descrição</label>
        <textarea
          name="description"
          placeholder="Descrição da tarefa"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <label className="font-semibold">Data/Hora para atribuição</label>
        <input
          name="assignAt"
          type="datetime-local"
          value={form.assignAt}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded mt-4"
          disabled={loading}
        >
          {loading ? 'Criando...' : 'Criar Tarefa'}
        </button>
      </form>
    </div>
  );
};

export default TaskCreation;