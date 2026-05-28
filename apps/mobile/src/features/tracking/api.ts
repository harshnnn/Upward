import { apiClient } from '../../shared/lib/http-client';

export const trackersApi = {
  create: (payload: any) => apiClient.post('/tracking/trackers', payload).then((r) => r.data),
  list: (page = 1, perPage = 20) => apiClient.get('/tracking/trackers', { params: { page, perPage } }).then((r) => r.data),
  get: (id: string) => apiClient.get(`/tracking/trackers/${id}`).then((r) => r.data),
  update: (id: string, payload: any) => apiClient.patch(`/tracking/trackers/${id}`, payload).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/tracking/trackers/${id}`).then((r) => r.data)
};

export const entriesApi = {
  create: (payload: any) => apiClient.post('/tracking/entries', payload).then((r) => r.data),
  list: (params: any) => apiClient.get('/tracking/entries', { params }).then((r) => r.data),
  update: (id: string, payload: any) => apiClient.patch(`/tracking/entries/${id}`, payload).then((r) => r.data),
  delete: (id: string) => apiClient.delete(`/tracking/entries/${id}`).then((r) => r.data)
};

export const goalsApi = {
  create: (payload: any) => apiClient.post('/tracking/goals', payload).then((r) => r.data),
  list: () => apiClient.get('/tracking/goals').then((r) => r.data)
};

export default { trackersApi, entriesApi, goalsApi };
