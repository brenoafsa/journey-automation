import api from './api';

export type EventParticipant = {
  user: string | { _id: string; name: string };
  status: 'invited' | 'accepted' | 'declined';
};

export type EventCreateRequest = {
  title: string;
  description: string;
  location: string;
  date: string;
  sendInvitesAt: string;
  inviteMessage: string;
  participants: EventParticipant[];
};

export type EventResponse = {
  _id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  sendInvitesAt: string;
  createdBy: string;
  inviteMessage: string;
  participants: EventParticipant[];
};

export const eventService = {
  async create(eventData: EventCreateRequest): Promise<EventResponse> {
    const response = await api.post<EventResponse>('/event', eventData);
    return response.data;
  },

  async getAll(): Promise<EventResponse[]> {
    const response = await api.get<EventResponse[]>('/event');
    return response.data;
  },

  async getAllByUserId(): Promise<EventResponse[]> {
    const response = await api.get<EventResponse[]>('/event/user');
    return response.data;
  },

  async getById(id: string): Promise<EventResponse> {
    const response = await api.get<EventResponse>(`/event/${id}`);
    return response.data;
  },

  async respondInvitation(eventId: string, status: 'accepted' | 'declined') {
    const response = await api.post(`/event/respond/${eventId}`, { status });
    return response.data;
    }
};