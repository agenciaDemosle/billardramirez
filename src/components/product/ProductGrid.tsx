import type { Product } from '../../types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({
  products,
  isLoading = false,
  columns = 4,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-sm text-gray-500 uppercase tracking-wider">No se encontraron productos</p>
      </div>
    );
  }

  // Grid responsivo estilo redecora con espaciado generoso
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-x-5 gap-y-10 md:gap-x-8 md:gap-y-14`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
