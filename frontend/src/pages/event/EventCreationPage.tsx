import React, { useEffect, useState } from 'react';
import { eventService, EventCreateRequest } from '../../services/eventService';
import { userService, User } from '../../services/userService';

const EventCreation: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    sendInvitesAt: '',
    inviteMessage: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    userService.getAll()
      .then(setUsers)
      .catch(() => setError('Erro ao carregar usuários'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUserSelect = (id: string) => {
    setSelectedUsers(prev =>
      prev.includes(id) ? prev.filter(u => u !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const toIsoUtc = (local: string) => {
      if (!local) return '';
      const withSeconds = local.length === 16 ? local + ':00' : local;
      return new Date(withSeconds).toISOString();
    };

    try {
      const eventData = {
        title: form.title,
        description: form.description,
        location: form.location,
        date: toIsoUtc(form.date),
        sendInvitesAt: toIsoUtc(form.sendInvitesAt),
        inviteMessage: form.inviteMessage,
        participants: selectedUsers.map(userId => ({ user: userId }))
      };
      await eventService.create(eventData as any);
      setSuccess('Evento criado com sucesso!');
      setForm({
        title: '',
        description: '',
        location: '',
        date: '',
        sendInvitesAt: '',
        inviteMessage: '',
      });
      setSelectedUsers([]);
    } catch {
      setError('Erro ao criar evento');
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
        <h2 className="text-2xl font-bold mb-4">Criar Evento</h2>
        <label className="font-semibold">Título</label>
        <input
          name="title"
          placeholder="Título"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <label className="font-semibold">Descrição</label>
        <textarea
          name="description"
          placeholder="Descrição"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <label className="font-semibold">Local</label>
        <input
          name="location"
          placeholder="Local"
          value={form.location}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <label className="font-semibold">Data do evento</label>
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <label className="font-semibold">Quando enviar o convite?</label>
        <input
          name="sendInvitesAt"
          type="datetime-local"
          value={form.sendInvitesAt}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <label className="font-semibold">Mensagem do convite</label>
        <textarea
          name="inviteMessage"
          placeholder="Mensagem do convite"
          value={form.inviteMessage}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <div>
          <label className="font-semibold mb-2 block">Participantes:</label>
          <div className="flex flex-wrap gap-2">
            {users.map(user => (
              <label key={user._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleUserSelect(user._id)}
                />
                {user.name} ({user.email})
              </label>
            ))}
          </div>
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded mt-4"
          disabled={loading}
        >
          {loading ? 'Criando...' : 'Criar Evento'}
        </button>
      </form>
    </div>
  );
};

export default EventCreation;