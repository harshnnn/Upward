import { apiClient } from '../../shared/lib/http-client';

export const workoutsApi = {
  listExercises: (params: any) => apiClient.get('/workouts/exercises', { params }).then((r) => r.data),
  createSession: (payload: any) => apiClient.post('/workouts/sessions', payload).then((r) => r.data),
  logSet: (sessionId: string, exerciseLogId: string, payload: any) => apiClient.post(`/workouts/sessions/${sessionId}/exercises/${exerciseLogId}/sets`, payload).then((r) => r.data),
  listSessions: (params: any) => apiClient.get('/workouts/sessions', { params }).then((r) => r.data),
  listPRs: () => apiClient.get('/workouts/prs').then((r) => r.data)
};

export default workoutsApi;
