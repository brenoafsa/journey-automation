import api from "./api";

export interface TaskCreateRequest {
  user: string;
  description: string;
  assignAt: string;
}

export interface TaskResponse {
  _id: string;
  user: string;
  description: string;
  assignAt: string;
  status: 'pending' | 'completed';
}

export const taskService = {
  create: async (task: TaskCreateRequest) => {
    const response = await api.post('/task', task, {
      withCredentials: true,
    });
    return response.data;
  },
  getAllByUserId: async (): Promise<TaskResponse[]> => {
    const response = await api.get('/task/user', { withCredentials: true });
    return response.data;
  },
  complete: async (id: string) => {
    const response = await api.post(`/task/complete/${id}`, {}, { withCredentials: true });
    return response.data;
  }
};