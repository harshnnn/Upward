import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from './api';

export const useDailySummary = (date?: string) => useQuery(['web','analytics','daily', date ?? 'today'], () => analyticsApi.dailySummary(date), { staleTime: 1000 * 30 });

export const useHeatmap = (from?: string, to?: string) => useQuery(['web','analytics','heatmap', from ?? '', to ?? ''], () => analyticsApi.heatmap(from, to), { staleTime: 1000 * 60 * 5 });

export const useStreaks = () => useQuery(['web','analytics','streaks'], () => analyticsApi.streaks(), { staleTime: 1000 * 60 * 5 });

export const useTrends = (metric?: string, from?: string, to?: string) => useQuery(['web','analytics','trends', metric ?? 'activity', from ?? '', to ?? ''], () => analyticsApi.trends(metric, from, to), { staleTime: 1000 * 60 * 5 });

export default {};
