import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { journalApi } from './api';

export const useJournalEntries = (params: any) => useQuery(['mobile', 'journal', 'entries', params], () => journalApi.listEntries(params), { keepPreviousData: true });

export const useCreateJournalEntry = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => journalApi.createEntry(payload), { onSuccess: () => qc.invalidateQueries(['mobile', 'journal', 'entries']) });
};

export const useSearchJournal = (q: string) => useQuery(['mobile', 'journal', 'search', q], () => journalApi.search(q), { enabled: Boolean(q) });

export default {};
