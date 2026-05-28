import { apiClient } from '../../shared/lib/http-client';

export const analyticsApi = {
  dailySummary: (date?: string) => apiClient.get('/analytics/daily-summary', { params: { date } }).then(r => r.data),
  heatmap: (from?: string, to?: string) => apiClient.get('/analytics/heatmap', { params: { from, to } }).then(r => r.data),
  streaks: () => apiClient.get('/analytics/streaks').then(r => r.data),
  trends: (metric?: string, from?: string, to?: string) => apiClient.get('/analytics/trends', { params: { metric, from, to } }).then(r => r.data)
};

export default analyticsApi;
