import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trackersApi, entriesApi, goalsApi } from './api';

export const useTrackers = (page = 1) => {
  return useQuery(['trackers', page], () => trackersApi.list(page));
};

export const useCreateTracker = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => trackersApi.create(payload), {
    onSuccess: () => qc.invalidateQueries(['trackers'])
  });
};

export const useEntries = (params: any) => {
  return useQuery(['entries', params], () => entriesApi.list(params), { keepPreviousData: true });
};

export const useCreateEntry = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => entriesApi.create(payload), {
    onSuccess: () => qc.invalidateQueries(['entries'])
  });
};

export const useGoals = () => useQuery(['goals'], () => goalsApi.list());

export default {};
