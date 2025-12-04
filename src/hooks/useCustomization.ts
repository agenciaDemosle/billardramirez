import { useQuery } from '@tanstack/react-query';
import { wooApi } from '../api/woocommerce';

interface LaserEngravingPrice {
  price: number;
  formatted: string;
}

/**
 * Hook para obtener el precio del grabado láser desde WordPress
 */
export function useLaserEngravingPrice() {
  return useQuery<LaserEngravingPrice>({
    queryKey: ['customization', 'laser-engraving-price'],
    queryFn: async () => {
      try {
        const response = await wooApi.getCustomizationPrice();
        return response;
      } catch (error) {
        console.error('Error fetching laser engraving price:', error);
        // Valor por defecto en caso de error
        return {
          price: 10000,
          formatted: '$10.000'
        };
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    cacheTime: 30 * 60 * 1000, // 30 minutos
    retry: 2,
  });
}
