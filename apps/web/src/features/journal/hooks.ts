import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from './api';

export const useJournalEntries = (params: any) => useQuery(['journal', 'entries', params], () => journalApi.listEntries(params), { keepPreviousData: true });

export const useCreateJournalEntry = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => journalApi.createEntry(payload), { onSuccess: () => qc.invalidateQueries(['journal', 'entries']) });
};

export const useSearchEntries = (q: string) => useQuery(['journal', 'search', q], () => journalApi.search(q), { enabled: Boolean(q) });

export default {};
