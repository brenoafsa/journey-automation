import api from './api';

export type User = {
  _id: string;
  name: string;
  email: string;
};

export const userService = {
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/user');
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/user/me');
    return response.data;
  },
};