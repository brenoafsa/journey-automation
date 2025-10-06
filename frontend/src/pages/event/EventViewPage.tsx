import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { eventService, EventResponse } from '../../services/eventService';

const statusColor = (status?: string) => {
  if (status === 'accepted') return 'text-green-600 font-bold';
  if (status === 'declined') return 'text-red-600 font-bold';
  return 'text-yellow-600 font-bold';
};

const EventViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    eventService.getById(id)
      .then(ev => setEvent(ev))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Carregando evento...</div>;
  if (!event) return <div>Evento não encontrado.</div>;

  return (
    <div className="flex flex-col items-center mt-8">
      <div className="bg-white shadow rounded p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <div className="mb-2">{event.description}</div>
        <div className="text-gray-700 mb-2">
          <strong>Local:</strong> {event.location}
        </div>
        <div className="text-gray-700 mb-2">
          <strong>Data:</strong> {new Date(event.date).toLocaleString()}
        </div>
        <div className="text-gray-700 mb-4">
          <strong>Mensagem do convite:</strong> {event.inviteMessage}
        </div>
        <h3 className="text-lg font-semibold mb-2">Participantes</h3>
        <ul>
          {event.participants.map((p: any) => (
            <li key={typeof p.user === 'object' ? p.user._id : p.user} className="flex items-center gap-2 mb-1">
              <span>{typeof p.user === 'object' ? p.user.name : 'Desconhecido'}</span>
              <span className={statusColor(p.status)}>
                {p.status === 'accepted'
                  ? 'Aceito'
                  : p.status === 'declined'
                  ? 'Rejeitado'
                  : 'Esperando'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventViewPage;