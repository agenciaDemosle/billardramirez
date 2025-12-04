import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { formatPrice } from '../../utils/helpers';

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem, total } = useCart();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 transition-opacity" />
        </Transition.Child>

        {/* Drawer */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                      <Dialog.Title className="text-sm uppercase tracking-wider">
                        Carrito ({items.length})
                      </Dialog.Title>
                      <button
                        type="button"
                        className="p-2 text-gray-400 hover:text-black transition-colors"
                        onClick={closeCart}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center px-6">
                          <p className="text-sm text-gray-500 mb-8">
                            Tu carrito está vacío
                          </p>
                          <Link
                            to="/tienda"
                            onClick={closeCart}
                            className="text-xs uppercase tracking-wider border-b border-black pb-0.5 hover:text-gray-600 transition-colors"
                          >
                            Explorar productos
                          </Link>
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-100">
                          {items.map((item) => (
                            <li key={item.id} className="px-6 py-6">
                              <div className="flex gap-4">
                                {/* Image */}
                                <div className="w-24 h-24 bg-[#f5f5f5] flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>

                                {/* Details */}
                                <div className="flex flex-1 flex-col">
                                  <div className="flex justify-between gap-2">
                                    <h3 className="text-sm text-gray-900 leading-snug pr-2">
                                      {item.name}
                                    </h3>
                                    <button
                                      type="button"
                                      className="text-gray-400 hover:text-black transition-colors flex-shrink-0"
                                      onClick={() => removeItem(item.id)}
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>

                                  {item.variation && (
                                    <p className="mt-1 text-xs text-gray-400">
                                      {Object.entries(item.variation)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(' / ')}
                                    </p>
                                  )}

                                  {item.customization?.laserEngraving?.enabled && (
                                    <p className="mt-1 text-xs text-gray-400">
                                      Grabado: "{item.customization.laserEngraving.text}"
                                    </p>
                                  )}

                                  {item.customization?.clothChange && (
                                    <p className="mt-1 text-xs text-gray-400">
                                      {item.customization.clothChange.dimensions} - {item.customization.clothChange.color}
                                    </p>
                                  )}

                                  <div className="flex items-center justify-between mt-auto pt-3">
                                    {/* Quantity Controls */}
                                    <div className="flex items-center border border-gray-300">
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-30"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                      >
                                        <Minus size={12} />
                                      </button>
                                      <span className="w-8 text-center text-xs">
                                        {item.quantity}
                                      </span>
                                      <button
                                        type="button"
                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                      >
                                        <Plus size={12} />
                                      </button>
                                    </div>

                                    {/* Price */}
                                    <p className="text-sm text-gray-900">
                                      {formatPrice(
                                        (item.price + (item.customization?.laserEngraving?.enabled ? item.customization.laserEngraving.price : 0)) * item.quantity
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="border-t border-gray-200 px-6 py-6">
                        {/* Subtotal */}
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-sm text-gray-500">Subtotal</span>
                          <span className="text-lg text-gray-900">
                            {formatPrice(total)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-6">
                          Envío calculado en el checkout
                        </p>

                        {/* Actions */}
                        <div className="space-y-3">
                          <Link to="/checkout" onClick={closeCart} className="block">
                            <button className="w-full bg-black text-white text-xs uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors">
                              Finalizar compra
                            </button>
                          </Link>
                          <Link to="/tienda" onClick={closeCart} className="block">
                            <button className="w-full text-xs uppercase tracking-wider py-3 text-gray-500 hover:text-black transition-colors">
                              Continuar comprando
                            </button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
