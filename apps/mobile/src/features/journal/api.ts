import { apiClient } from '../../shared/lib/http-client';

export const journalApi = {
  createEntry: (payload: any) => apiClient.post('/journal/entries', payload).then((r) => r.data),
  listEntries: (params: any) => apiClient.get('/journal/entries', { params }).then((r) => r.data),
  search: (q: string) => apiClient.get('/journal/search', { params: { q } }).then((r) => r.data),
  tags: {
    list: () => apiClient.get('/journal/tags').then((r) => r.data),
    create: (payload: any) => apiClient.post('/journal/tags', payload).then((r) => r.data)
  },
  moods: {
    create: (payload: any) => apiClient.post('/journal/moods', payload).then((r) => r.data)
  }
};

export default journalApi;
