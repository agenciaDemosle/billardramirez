import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useProductBySlug, useProducts } from '../hooks/useProducts';
import ProductDetail from '../components/product/ProductDetail';
import ProductGrid from '../components/product/ProductGrid';
import SEO, { stripHtml, truncateDescription, formatPriceForSchema } from '../components/SEO';

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
        <SEO
          title="Producto no encontrado"
          description="El producto que buscas no existe o ha sido eliminado."
          noindex={true}
        />
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

  // Generate SEO data
  const productDescription = truncateDescription(
    product.short_description || product.description || `${product.name} - Compra en Billard Ramirez con envío a todo Chile.`,
    160
  );

  const productImage = product.images?.[0]?.src || 'https://billardramirez.cl/images/logo.png';

  const breadcrumbs = [
    { name: 'Inicio', url: 'https://billardramirez.cl/' },
    { name: 'Tienda', url: 'https://billardramirez.cl/tienda' },
    ...(product.categories[0] ? [{
      name: product.categories[0].name,
      url: `https://billardramirez.cl/tienda?categoria=${product.categories[0].slug}`
    }] : []),
    { name: product.name, url: `https://billardramirez.cl/producto/${product.slug}` }
  ];

  const productSEO = {
    name: product.name,
    description: stripHtml(product.short_description || product.description || ''),
    image: productImage,
    price: formatPriceForSchema(product.price),
    currency: 'CLP',
    availability: (product.stock_status === 'instock' ? 'InStock' : 'OutOfStock') as 'InStock' | 'OutOfStock',
    sku: product.sku || `BR-${product.id}`,
    brand: 'Billard Ramirez',
    category: product.categories[0]?.name || 'Productos de Billar'
  };

  // Generate keywords based on product
  const generateKeywords = () => {
    const keywords = [
      product.name.toLowerCase(),
      'billard ramirez',
      'comprar online chile',
      'envío a todo chile'
    ];

    if (product.categories[0]) {
      keywords.push(product.categories[0].name.toLowerCase());
    }

    // Add category-specific keywords
    const categorySlug = product.categories[0]?.slug || '';
    if (categorySlug.includes('mesa') || categorySlug.includes('pool')) {
      keywords.push('mesa de pool', 'mesa de billar', 'mesa pool profesional', 'mesa pool chile');
    }
    if (categorySlug.includes('taco')) {
      keywords.push('taco de billar', 'taco pool', 'taco profesional');
    }
    if (categorySlug.includes('bola')) {
      keywords.push('bolas de pool', 'bolas de billar', 'set bolas pool');
    }
    if (categorySlug.includes('accesorio')) {
      keywords.push('accesorios billar', 'accesorios pool', 'tiza billar');
    }

    return keywords.join(', ');
  };

  return (
    <div className="bg-white">
      <SEO
        title={`${product.name} - Comprar en Billard Ramirez`}
        description={productDescription}
        canonical={`https://billardramirez.cl/producto/${product.slug}`}
        ogImage={productImage}
        ogType="product"
        keywords={generateKeywords()}
        breadcrumbs={breadcrumbs}
        product={productSEO}
      />

      {/* Breadcrumbs */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-4">
          <nav className="flex items-center gap-2 text-xs text-gray-500" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-black transition-colors">
              Inicio
            </Link>
            <ChevronRight size={12} aria-hidden="true" />
            <Link to="/tienda" className="hover:text-black transition-colors">
              Tienda
            </Link>
            {product.categories[0] && (
              <>
                <ChevronRight size={12} aria-hidden="true" />
                <Link
                  to={`/tienda?categoria=${product.categories[0].slug}`}
                  className="hover:text-black transition-colors"
                >
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <ChevronRight size={12} aria-hidden="true" />
            <span className="text-black truncate max-w-[200px]" aria-current="page">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <ProductDetail product={product} />

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 1 && (
        <section className="border-t border-gray-200" aria-labelledby="related-products-heading">
          <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-16 lg:py-24">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
                  También te puede interesar
                </p>
                <h2 id="related-products-heading" className="text-2xl md:text-3xl font-display uppercase tracking-wide">
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
