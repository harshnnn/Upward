import { axiosInstance } from '../../shared/lib/http-client';

export const trackersApi = {
  create: (payload: any) => axiosInstance.post('/tracking/trackers', payload).then((r) => r.data),
  list: (page = 1, perPage = 20) => axiosInstance.get('/tracking/trackers', { params: { page, perPage } }).then((r) => r.data),
  get: (id: string) => axiosInstance.get(`/tracking/trackers/${id}`).then((r) => r.data),
  update: (id: string, payload: any) => axiosInstance.patch(`/tracking/trackers/${id}`, payload).then((r) => r.data),
  delete: (id: string) => axiosInstance.delete(`/tracking/trackers/${id}`).then((r) => r.data)
};

export const entriesApi = {
  create: (payload: any) => axiosInstance.post('/tracking/entries', payload).then((r) => r.data),
  list: (params: any) => axiosInstance.get('/tracking/entries', { params }).then((r) => r.data),
  update: (id: string, payload: any) => axiosInstance.patch(`/tracking/entries/${id}`, payload).then((r) => r.data),
  delete: (id: string) => axiosInstance.delete(`/tracking/entries/${id}`).then((r) => r.data)
};

export const goalsApi = {
  create: (payload: any) => axiosInstance.post('/tracking/goals', payload).then((r) => r.data),
  list: () => axiosInstance.get('/tracking/goals').then((r) => r.data)
};

export default { trackersApi, entriesApi, goalsApi };
