import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useProductBySlug, useProducts } from '../hooks/useProducts';
import ProductDetail from '../components/product/ProductDetail';
import ProductGrid from '../components/product/ProductGrid';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProductBySlug(slug || '');

  // Get related products
  const { data: relatedProducts } = useProducts({
    category: product?.categories[0]?.id.toString(),
    perPage: 4,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-display uppercase tracking-wide mb-4">
              Producto no encontrado
            </h1>
            <p className="text-gray-500 mb-8">
              Lo sentimos, el producto que buscas no existe o ha sido eliminado.
            </p>
            <Link
              to="/tienda"
              className="inline-block text-sm uppercase tracking-wider border-b border-black pb-1 hover:text-gray-600 transition-colors"
            >
              Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Breadcrumbs */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <Link to="/" className="hover:text-black transition-colors">
              Inicio
            </Link>
            <ChevronRight size={12} />
            <Link to="/tienda" className="hover:text-black transition-colors">
              Tienda
            </Link>
            {product.categories[0] && (
              <>
                <ChevronRight size={12} />
                <Link
                  to={`/tienda?categoria=${product.categories[0].slug}`}
                  className="hover:text-black transition-colors"
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <ChevronRight size={12} />
            <span className="text-black truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <ProductDetail product={product} />

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 1 && (
        <section className="border-t border-gray-200">
          <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
                  También te puede interesar
                </p>
                <h2 className="text-2xl md:text-3xl font-display uppercase tracking-wide">
                  Productos Relacionados
                </h2>
              </div>
              <Link
                to={`/tienda?categoria=${product.categories[0]?.slug || ''}`}
                className="hidden md:inline-block text-sm uppercase tracking-wider border-b border-black pb-1 hover:text-gray-600 transition-colors"
              >
                Ver todos
              </Link>
            </div>
            <ProductGrid
              products={relatedProducts.filter((p) => p.id !== product.id).slice(0, 4)}
              columns={4}
            />
          </div>
        </section>
      )}
    </div>
  );
}
