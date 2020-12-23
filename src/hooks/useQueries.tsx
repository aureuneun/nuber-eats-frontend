import { useLocation } from 'react-router-dom';

export const useQueries = (queries: string[]): string[] => {
  const urlSearch = new URLSearchParams(useLocation().search);
  return queries.map((query) => urlSearch.get(query) || '');
};
