import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workoutsApi } from './api';

export const useMobileExercises = (q?: string) => useQuery(['mobile','workouts','exercises', q ?? 'all'], () => workoutsApi.listExercises({ q }), { staleTime: 1000 * 60 * 5 });

export const useMobileCreateSession = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => workoutsApi.createSession(payload), { onSuccess: () => qc.invalidateQueries(['mobile','workouts','sessions']) });
};

export const useMobileLogSet = () => {
  const qc = useQueryClient();
  return useMutation(({ sessionId, exerciseLogId, payload }: any) => workoutsApi.logSet(sessionId, exerciseLogId, payload), { onSuccess: () => qc.invalidateQueries(['mobile','workouts','sessions']) });
};

export default {};
