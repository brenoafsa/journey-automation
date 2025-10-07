import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventResponse } from '../../services/eventService';
import { eventService } from '../../services/eventService';

interface EventCardProps {
  event: EventResponse;
  userId: string;
  onRespond?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, userId, onRespond }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(() => {
    const participant = event.participants.find(p => (typeof p.user === 'object' ? p.user._id : p.user) === userId);
    return participant ? participant.status : null;
  });

  const isParticipant = event.participants.some(p => (typeof p.user === 'object' ? p.user._id : p.user) === userId);

  const showButtons = isParticipant && status === 'invited';

  const handleRespond = async (newStatus: 'accepted' | 'declined') => {
    await eventService.respondInvitation(event._id, newStatus);
    setStatus(newStatus);
    if (onRespond) onRespond();
  };

  let cardColor = 'bg-white';
  if (status === 'accepted') cardColor = 'bg-green-100';
  if (status === 'declined') cardColor = 'bg-red-100';

  return (
    <div
      className={`${cardColor} shadow rounded p-4 mb-4 cursor-pointer hover:bg-gray-100 transition flex items-center`}
      onClick={() => navigate(`/event-view/${event._id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={e => { if (e.key === 'Enter') navigate(`/event-view/${event._id}`); }}
    >
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{event.title}</h3>
        <p>{event.description}</p>
        <div className="text-sm text-gray-600">
          Local: {event.location}<br />
          Data: {new Date(event.date).toLocaleString()}
        </div>
      </div>
      {showButtons && (
        <div className="flex gap-2 ml-4" onClick={e => e.stopPropagation()}>
          <button
            className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition"
            title="Aceitar convite"
            onClick={() => handleRespond('accepted')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
            title="Recusar convite"
            onClick={() => handleRespond('declined')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCard;