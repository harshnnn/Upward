import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vocabApi } from './api';

export const useMobileVocabList = (q?: string) => useQuery(['mobile','vocab','list', q ?? 'all'], () => vocabApi.listWords({ q }), { staleTime: 1000 * 60 * 5 });

export const useMobileCreateWord = () => {
  const qc = useQueryClient();
  return useMutation((payload: any) => vocabApi.createWord(payload), { onSuccess: () => qc.invalidateQueries(['mobile','vocab','list']) });
};

export default {};
