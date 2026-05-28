import { apiClient } from '../../shared/lib/http-client';

export const vocabApi = {
  createWord: (payload: any) => apiClient.post('/vocab/words', payload).then((r) => r.data),
  listWords: (params: any) => apiClient.get('/vocab/words', { params }).then((r) => r.data),
  addSentence: (id: string, payload: any) => apiClient.post(`/vocab/words/${id}/sentences`, payload).then((r) => r.data),
  scheduleRevision: (payload: any) => apiClient.post('/vocab/revisions', payload).then((r) => r.data),
  listRevisions: (params: any) => apiClient.get('/vocab/revisions', { params }).then((r) => r.data)
};

export default vocabApi;
