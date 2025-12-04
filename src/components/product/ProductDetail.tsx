import { useState } from 'react';
import {
  Minus,
  Plus,
  ShoppingCart,
  Check,
  Truck,
  Shield,
  RefreshCw,
  Share2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import type { Product } from '../../types/product';
import { formatPrice, getDiscountPercentage } from '../../utils/helpers';
import { useCart } from '../../hooks/useCart';
import { useLaserEngravingPrice } from '../../hooks/useCustomization';
import { Helmet } from 'react-helmet-async';
import PoolTableSpecs from './PoolTableSpecs';
import PoolTableQuotation from './PoolTableQuotation';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart();
  const { data: laserPriceData } = useLaserEngravingPrice();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [laserEngravingEnabled, setLaserEngravingEnabled] = useState(false);
  const [laserEngravingText, setLaserEngravingText] = useState('');

  const discount = getDiscountPercentage(product.regular_price, product.sale_price);
  const inStock = product.stock_status === 'instock';
  const price = parseFloat(product.price);

  // Check if product is a pool table
  const POOL_TABLE_CATEGORY_IDS = [27, 39, 40];
  const isPoolTable = product.categories.some(
    (cat) => POOL_TABLE_CATEGORY_IDS.includes(cat.id)
  );

  // Check if product is a taco (cue stick)
  const isTaco = product.categories.some(
    (cat) => cat.slug === 'tacos'
  );

  const LASER_ENGRAVING_PRICE = laserPriceData?.price || 10000;

  const handleAddToCart = () => {
    const customization = laserEngravingEnabled && laserEngravingText.trim()
      ? {
          laserEngraving: {
            enabled: true,
            text: laserEngravingText.trim(),
            price: LASER_ENGRAVING_PRICE,
          },
        }
      : undefined;

    addToCart(product, quantity, undefined, undefined, customization);
  };

  const handleBuyNow = () => {
    const customization = laserEngravingEnabled && laserEngravingText.trim()
      ? {
          laserEngraving: {
            enabled: true,
            text: laserEngravingText.trim(),
            price: LASER_ENGRAVING_PRICE,
          },
        }
      : undefined;

    addToCart(product, quantity, undefined, undefined, customization);
    window.location.href = '/checkout';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.short_description.replace(/<[^>]*>/g, ''),
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Billard Ramirez</title>
        <meta name="description" content={product.short_description.replace(/<[^>]*>/g, '').substring(0, 160)} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.short_description.replace(/<[^>]*>/g, '').substring(0, 160)} />
        <meta property="og:image" content={product.images[0]?.src} />
        <meta property="og:type" content="product" />
        <meta property="product:price:amount" content={product.price} />
        <meta property="product:price:currency" content="CLP" />
      </Helmet>

      <div className="bg-white">
        <div className="max-w-[1590px] mx-auto px-5 md:px-8 lg:px-16 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div
                className="relative aspect-square bg-[#f5f5f5] cursor-zoom-in group"
                onClick={() => setIsImageZoomed(true)}
              >
                <img
                  src={product.images[selectedImage]?.src || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />

                {/* Sale Badge */}
                {product.on_sale && discount > 0 && (
                  <div className="absolute top-6 left-6">
                    <span className="bg-black text-white text-[10px] uppercase tracking-wider px-3 py-1.5 font-medium">
                      -{discount}%
                    </span>
                  </div>
                )}

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Imagen siguiente"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 bg-[#f5f5f5] transition-opacity ${
                        selectedImage === index ? 'opacity-100 ring-1 ring-black' : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={image.src}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="lg:max-w-xl">
              {/* Category */}
              {product.categories[0] && (
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">
                  {product.categories[0].name}
                </p>
              )}

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-display text-black uppercase tracking-wide mb-6">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mb-8">
                {isPoolTable ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-sm text-gray-500">Desde</span>
                    <span className="text-2xl md:text-3xl text-black">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-4">
                    <span className="text-2xl md:text-3xl text-black">
                      {formatPrice(product.price)}
                    </span>
                    {product.on_sale && product.regular_price && (
                      <span className="text-lg text-gray-400 line-through">
                        {formatPrice(product.regular_price)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Short Description */}
              <div
                className="prose prose-sm max-w-none text-gray-600 mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.short_description }}
              />

              {/* Stock Status */}
              <div className="mb-8">
                {inStock ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-600">En stock</span>
                    {product.stock_quantity && product.manage_stock && (
                      <span className="text-gray-400">
                        ({product.stock_quantity} disponibles)
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    <span className="text-gray-600">Agotado</span>
                  </div>
                )}
              </div>

              {/* Laser Engraving - Only for tacos */}
              {inStock && isTaco && (
                <div className="border border-gray-200 p-6 mb-8">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="laser-engraving"
                      checked={laserEngravingEnabled}
                      onChange={(e) => {
                        setLaserEngravingEnabled(e.target.checked);
                        if (!e.target.checked) setLaserEngravingText('');
                      }}
                      className="mt-1 h-4 w-4 rounded-none border-gray-300 text-black focus:ring-black"
                    />
                    <div className="flex-1">
                      <label htmlFor="laser-engraving" className="flex items-center gap-3 cursor-pointer">
                        <span className="text-sm font-medium">Grabado Láser Personalizado</span>
                        <span className="text-sm text-gray-500">+{formatPrice(LASER_ENGRAVING_PRICE)}</span>
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Personaliza tu taco con un nombre o texto (máx. 20 caracteres)
                      </p>
                    </div>
                  </div>

                  {laserEngravingEnabled && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <input
                        type="text"
                        value={laserEngravingText}
                        onChange={(e) => {
                          if (e.target.value.length <= 20) {
                            setLaserEngravingText(e.target.value);
                          }
                        }}
                        placeholder="Tu texto aquí"
                        maxLength={20}
                        className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-black transition-colors bg-transparent"
                      />
                      <div className="flex justify-end mt-2">
                        <span className="text-xs text-gray-400">{laserEngravingText.length}/20</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pool Table Quotation */}
              {inStock && isPoolTable && (
                <div className="mb-8">
                  <PoolTableQuotation
                    basePrice={price}
                    productName={product.name}
                    description={product.description}
                  />
                </div>
              )}

              {/* Quantity & Add to Cart - Only for non-pool tables */}
              {inStock && !isPoolTable && (
                <div className="space-y-4 mb-8">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 w-fit">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center text-sm">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors"
                      disabled={product.stock_quantity ? quantity >= product.stock_quantity : false}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-black text-white text-sm uppercase tracking-wider py-4 px-6 flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors"
                    >
                      <ShoppingCart size={16} />
                      Agregar al carrito
                    </button>
                    <button
                      onClick={handleShare}
                      className="w-12 h-12 border border-gray-300 flex items-center justify-center hover:border-black transition-colors"
                      aria-label="Compartir"
                    >
                      <Share2 size={16} />
                    </button>
                  </div>

                  {/* Buy Now */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full border border-black text-sm uppercase tracking-wider py-4 hover:bg-black hover:text-white transition-colors"
                  >
                    Comprar ahora
                  </button>
                </div>
              )}

              {/* Trust Badges */}
              <div className="border-t border-gray-200 pt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <Truck size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-black">Envío a todo Chile</p>
                    <p className="text-xs text-gray-500">3-5 días hábiles</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Shield size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-black">Garantía 12 meses</p>
                    <p className="text-xs text-gray-500">En todos nuestros productos</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <RefreshCw size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-black">Devoluciones</p>
                    <p className="text-xs text-gray-500">30 días para cambios</p>
                  </div>
                </div>
              </div>

              {/* SKU */}
              {product.sku && (
                <p className="text-xs text-gray-400 mt-8">
                  SKU: {product.sku}
                </p>
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-20 border-t border-gray-200 pt-12">
            {/* Tab Navigation */}
            <div className="flex gap-8 mb-8 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 text-sm uppercase tracking-wider transition-colors relative ${
                  activeTab === 'description' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Descripción
                {activeTab === 'description' && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-black" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-4 text-sm uppercase tracking-wider transition-colors relative ${
                  activeTab === 'specs' ? 'text-black' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                Especificaciones
                {activeTab === 'specs' && (
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-black" />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="max-w-3xl">
              {activeTab === 'description' && (
                <div
                  className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              )}

              {activeTab === 'specs' && (
                <div>
                  {product.attributes.length > 0 ? (
                    <div className="space-y-4">
                      {product.attributes.map((attr) => (
                        <div
                          key={attr.id}
                          className="flex border-b border-gray-100 pb-4"
                        >
                          <span className="w-1/3 text-sm text-gray-500">{attr.name}</span>
                          <span className="flex-1 text-sm text-black">{attr.options.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  ) : isPoolTable ? (
                    <PoolTableSpecs />
                  ) : (
                    <p className="text-sm text-gray-500">
                      No hay especificaciones disponibles para este producto.
                    </p>
                  )}

                  {isPoolTable && product.attributes.length > 0 && <PoolTableSpecs />}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Zoom Modal */}
        {isImageZoomed && (
          <div
            className="fixed inset-0 bg-white z-50 flex items-center justify-center"
            onClick={() => setIsImageZoomed(false)}
          >
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>

            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  aria-label="Siguiente"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            <img
              src={product.images[selectedImage]?.src || '/placeholder-product.jpg'}
              alt={product.name}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image Counter */}
            {product.images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-500">
                {selectedImage + 1} / {product.images.length}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
