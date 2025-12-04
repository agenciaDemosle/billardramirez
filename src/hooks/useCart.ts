import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import type { Product, CartItem } from '../types/product';

export function useCart() {
  const store = useCartStore();

  const addToCart = (
    product: Product,
    quantity = 1,
    variationId?: number,
    variation?: { [key: string]: string },
    customization?: CartItem['customization']
  ) => {
    store.addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      quantity,
      image: product.images[0]?.src || '',
      sku: product.sku,
      variationId,
      variation,
      customization,
    });

    toast.success(`${product.name} agregado al carrito`, {
      duration: 2000,
      position: 'bottom-right',
    });

    store.openCart();
  };

  const total = store.subtotal();
  const itemCount = store.itemCount();

  return {
    items: store.items,
    isOpen: store.isOpen,
    itemCount,
    total,
    subtotal: store.subtotal,
    addToCart,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    toggleCart: store.toggleCart,
    openCart: store.openCart,
    closeCart: store.closeCart,
  };
}
