import React, { useEffect, useState } from 'react';
import { eventService, EventResponse } from '../../services/eventService';
import EventCard from '../../components/event/EventCard';
import { userService, User } from '../../services/userService';

const EventListPage: React.FC = () => {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    userService.getMe().then(setUser);
    eventService.getAllByUserId()
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !user) return <div>Carregando eventos...</div>;

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-2xl font-bold mb-4">Meus Eventos</h2>
      <div className="w-full max-w-2xl">
        {events.length === 0 && <div>Nenhum evento encontrado.</div>}
        {events.map(event => (
          <EventCard key={event._id} event={event} userId={user._id} />
        ))}
      </div>
    </div>
  );
};

export default EventListPage;