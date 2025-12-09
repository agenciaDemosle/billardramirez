import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import { wooApi } from '../api/woocommerce';
import type { Product, Category } from '../types/product';

interface UseProductsParams {
  page?: number;
  perPage?: number;
  category?: string;
  search?: string;
  orderby?: string;
  order?: 'asc' | 'desc';
  featured?: boolean;
  onSale?: boolean;
  on_sale?: boolean;
}

export function useProducts(params: UseProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => wooApi.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useProduct(id: number): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => wooApi.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductBySlug(slug: string): UseQueryResult<Product, Error> {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => wooApi.getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCategories(): UseQueryResult<Category[], Error> {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => wooApi.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useFeaturedProducts(limit = 8): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products', 'featured', limit],
    queryFn: () => wooApi.getFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useOnSaleProducts(limit = 12): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products', 'on-sale', limit],
    queryFn: () => wooApi.getOnSaleProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useProductsByCategory(
  categoryId: number,
  params: UseProductsParams = {}
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products', 'category', categoryId, params],
    queryFn: () => wooApi.getProductsByCategory(categoryId, params),
    enabled: !!categoryId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useSearchProducts(
  query: string,
  params: UseProductsParams = {}
): UseQueryResult<Product[], Error> {
  return useQuery({
    queryKey: ['products', 'search', query, params],
    queryFn: () => wooApi.searchProducts(query, params),
    enabled: query.length >= 3,
    staleTime: 2 * 60 * 1000,
  });
}
