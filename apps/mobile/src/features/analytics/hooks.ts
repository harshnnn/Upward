import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from './api';

export const useMobileDailySummary = (date?: string) => useQuery(['mobile','analytics','daily', date ?? 'today'], () => analyticsApi.dailySummary(date), { staleTime: 1000 * 30 });

export const useMobileHeatmap = (from?: string, to?: string) => useQuery(['mobile','analytics','heatmap', from ?? '', to ?? ''], () => analyticsApi.heatmap(from, to), { staleTime: 1000 * 60 * 5 });

export const useMobileStreaks = () => useQuery(['mobile','analytics','streaks'], () => analyticsApi.streaks(), { staleTime: 1000 * 60 * 5 });

export const useMobileTrends = (metric?: string, from?: string, to?: string) => useQuery(['mobile','analytics','trends', metric ?? 'activity', from ?? '', to ?? ''], () => analyticsApi.trends(metric, from, to), { staleTime: 1000 * 60 * 5 });

export default {};
