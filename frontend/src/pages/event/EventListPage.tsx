import React, { useEffect, useState } from 'react';
import { eventService, EventResponse } from '../../services/eventService';
import EventCard from '../../components/event/EventCard';

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getAllByUserId()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Carregando eventos...</div>;

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Meus Eventos</h2>
      <div className="w-full max-w-2xl">
        {events.length === 0 && <div>Nenhum evento encontrado.</div>}
        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default EventListPage;