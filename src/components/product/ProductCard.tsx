import { Link } from 'react-router-dom';
import { ShoppingCart, Calculator } from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPrice, getDiscountPercentage, getProductUrl } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';
import { trackAddToCart, trackSelectItem } from '../../hooks/useAnalytics';

interface ProductCardProps {
  product: Product;
  listName?: string;
  listId?: string;
  index?: number;
}

export default function ProductCard({ product, listName, listId, index }: ProductCardProps) {
  const { addToCart } = useCart();
  const discount = getDiscountPercentage(product.regular_price, product.sale_price);
  const imageUrl = product.images[0]?.src || '/placeholder-product.jpg';

  // Verificar si el producto es una mesa de pool
  const poolTableCategories = [
    27,
    'mesas-de-pool',
    'superficie-en-madera',
    'superficie-en-piedra',
    'profesional',
    'recreacional'
  ];

  const isPoolTable = product.categories.some((cat) =>
    cat.id === 27 ||
    poolTableCategories.includes(cat.slug) ||
    cat.slug.includes('superficie') ||
    cat.name.toLowerCase().includes('mesa')
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);

    // Track add to cart
    trackAddToCart({
      product_id: product.id.toString(),
      product_name: product.name,
      product_category: product.categories[0]?.name || 'Sin categoría',
      product_price: parseFloat(product.price),
      quantity: 1,
      item_list_name: listName,
      item_list_id: listId,
      index: index,
    });
  };

  const handleProductClick = () => {
    // Track product click (select_item)
    trackSelectItem({
      product_id: product.id.toString(),
      product_name: product.name,
      product_category: product.categories[0]?.name || 'Sin categoría',
      price: parseFloat(product.price),
      item_list_name: listName,
      item_list_id: listId,
      index: index,
    });
  };

  return (
    <div className="group">
      <Link to={getProductUrl(product.slug)} onClick={handleProductClick} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#f5f5f5] mb-4">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Badges - Minimal style */}
          {product.on_sale && discount > 0 && (
            <div className="absolute top-4 left-4">
              <span className="bg-black text-white text-[10px] uppercase tracking-wider px-3 py-1.5 font-medium">
                -{discount}%
              </span>
            </div>
          )}

          {/* Out of Stock Overlay */}
          {product.stock_status === 'outofstock' && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <span className="text-xs uppercase tracking-wider text-gray-600 font-medium">
                Agotado
              </span>
            </div>
          )}

          {/* Quick Action - Appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            {product.stock_status === 'instock' && (
              <>
                {isPoolTable ? (
                  <button className="w-full bg-black text-white text-xs uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors">
                    <Calculator size={14} />
                    Cotizar
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-black text-white text-xs uppercase tracking-wider py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
                  >
                    <ShoppingCart size={14} />
                    Agregar
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Category */}
          {product.categories[0] && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
              {product.categories[0].name}
            </p>
          )}

          {/* Title */}
          <h3 className="text-sm text-gray-900 leading-snug group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-900">
              {formatPrice(product.price, product.id)}
            </span>
            {product.on_sale && product.regular_price && (
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.regular_price, product.id)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
