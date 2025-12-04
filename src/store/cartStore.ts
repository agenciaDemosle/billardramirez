import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '../types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;

  // Computed
  itemCount: () => number;
  subtotal: () => number;

  // Actions
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Computed values
      itemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce(
          (total, item) => {
            const itemPrice = item.price * item.quantity;
            const customizationPrice = item.customization?.laserEngraving?.enabled
              ? item.customization.laserEngraving.price * item.quantity
              : 0;
            return total + itemPrice + customizationPrice;
          },
          0
        );
      },

      // Actions
      addItem: (newItem) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variationId === newItem.variationId &&
              // Compare customization to ensure items with different customizations are separate
              JSON.stringify(item.customization) === JSON.stringify(newItem.customization)
          );

          if (existingItemIndex > -1) {
            // Item already exists with same customization, update quantity
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
            };
            return { items: updatedItems };
          } else {
            // New item or different customization, add to cart
            const newCartItem: CartItem = {
              ...newItem,
              id: Date.now(), // Simple ID generation
            };
            return { items: [...state.items, newCartItem] };
          }
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [], isOpen: false });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },
    }),
    {
      name: 'billard-ramirez-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
