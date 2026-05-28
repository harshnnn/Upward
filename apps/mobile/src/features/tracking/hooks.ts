import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trackersApi, entriesApi, goalsApi } from './api';

export const useTrackers = (page = 1) => useQuery(['mobile', 'trackers', page], () => trackersApi.list(page));

export const useCreateTracker = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => trackersApi.create(payload), { onSuccess: () => qc.invalidateQueries(['mobile', 'trackers']) });
};

export const useEntries = (params: any) => useQuery(['mobile', 'entries', params], () => entriesApi.list(params), { keepPreviousData: true });

export const useCreateEntry = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => entriesApi.create(payload), { onSuccess: () => qc.invalidateQueries(['mobile', 'entries']) });
};

export const useGoals = () => useQuery(['mobile', 'goals'], () => goalsApi.list());

export default {};
