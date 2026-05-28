import { axiosInstance } from '../../shared/lib/http-client';

export const journalApi = {
  createEntry: (payload: any) => axiosInstance.post('/journal/entries', payload).then((r) => r.data),
  listEntries: (params: any) => axiosInstance.get('/journal/entries', { params }).then((r) => r.data),
  getEntry: (id: string) => axiosInstance.get(`/journal/entries/${id}`).then((r) => r.data),
  updateEntry: (id: string, payload: any) => axiosInstance.patch(`/journal/entries/${id}`, payload).then((r) => r.data),
  deleteEntry: (id: string) => axiosInstance.delete(`/journal/entries/${id}`).then((r) => r.data),
  search: (q: string) => axiosInstance.get('/journal/search', { params: { q } }).then((r) => r.data),
  tags: {
    list: () => axiosInstance.get('/journal/tags').then((r) => r.data),
    create: (payload: any) => axiosInstance.post('/journal/tags', payload).then((r) => r.data)
  },
  categories: {
    list: () => axiosInstance.get('/journal/categories').then((r) => r.data),
    create: (payload: any) => axiosInstance.post('/journal/categories', payload).then((r) => r.data)
  },
  moods: {
    create: (payload: any) => axiosInstance.post('/journal/moods', payload).then((r) => r.data)
  }
};

export default journalApi;
