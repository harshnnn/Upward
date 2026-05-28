import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutsApi } from './api';

export const useExercises = (q?: string) => useQuery(['web','workouts','exercises', q ?? 'all'], () => workoutsApi.listExercises({ q }), { staleTime: 1000 * 60 * 5 });

export const useCreateSession = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => workoutsApi.createSession(payload), { onSuccess: () => qc.invalidateQueries(['web','workouts','sessions']) });
};

export const useSessions = () => useQuery(['web','workouts','sessions'], () => workoutsApi.listSessions({}), { staleTime: 1000 * 30 });

export const usePRs = () => useQuery(['web','workouts','prs'], () => workoutsApi.listPRs(), { staleTime: 1000 * 60 * 5 });

export default {};
