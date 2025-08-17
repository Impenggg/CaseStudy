import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsAPI } from '@/services/api';
import type { Product } from '@/types';

// Get all products with filtering
export const useProducts = (params?: {
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  featured?: boolean;
  per_page?: number;
  page?: number;
}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsAPI.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single product by ID
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.getById(id),
    enabled: !!id,
  });
};

// Get current user's products
export const useMyProducts = () => {
  return useQuery({
    queryKey: ['my-products'],
    queryFn: productsAPI.getMyProducts,
  });
};

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });
};

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Product> }) =>
      productsAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });
};

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
  });
};
