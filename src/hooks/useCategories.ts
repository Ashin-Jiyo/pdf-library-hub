import { useQuery } from '@tanstack/react-query';
import { categoryService } from '../services/categoryService';
import type { Category } from '../types';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      return await categoryService.getAllCategories();
    },
  });
};
