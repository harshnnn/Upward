import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vocabApi } from './api';

export const useVocabList = (q?: string) => useQuery(['web','vocab','list', q ?? 'all'], () => vocabApi.listWords({ q }), { staleTime: 1000 * 60 * 5 });

export const useCreateWord = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => vocabApi.createWord(payload), { onSuccess: () => qc.invalidateQueries(['web','vocab','list']) });
};

export const useWord = (id: string) => useQuery(['web','vocab','word', id], () => vocabApi.getWord(id));

export default {};
