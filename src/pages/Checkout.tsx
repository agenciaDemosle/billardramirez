import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ChevronLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../utils/helpers';
import { wooApi } from '../api/woocommerce';

// Regiones de Chile
const REGIONES_CHILE = [
  { code: 'AP', name: 'Arica y Parinacota' },
  { code: 'TA', name: 'Tarapacá' },
  { code: 'AN', name: 'Antofagasta' },
  { code: 'AT', name: 'Atacama' },
  { code: 'CO', name: 'Coquimbo' },
  { code: 'VS', name: 'Valparaíso' },
  { code: 'RM', name: 'Región Metropolitana' },
  { code: 'LI', name: "O'Higgins" },
  { code: 'ML', name: 'Maule' },
  { code: 'NB', name: 'Ñuble' },
  { code: 'BI', name: 'Biobío' },
  { code: 'AR', name: 'La Araucanía' },
  { code: 'LR', name: 'Los Ríos' },
  { code: 'LL', name: 'Los Lagos' },
  { code: 'AI', name: 'Aysén' },
  { code: 'MA', name: 'Magallanes' },
];

// Comunas con envío a $4.000 (Región Metropolitana)
const COMUNAS_ENVIO_4000 = [
  'Colina', 'San Bernardo', 'Puente Alto', 'Padre Hurtado', 'La Florida',
  'Peñalolén', 'Ñuñoa', 'Macul', 'Las Condes', 'Vitacura', 'Lo Barnechea',
  'La Reina', 'Lo Prado', 'Cerrillos', 'Maipú', 'Pudahuel', 'Santiago Centro',
  'Estación Central', 'Quinta Normal', 'Providencia', 'Lo Espejo', 'Quilicura',
  'Cerro Navia', 'Renca', 'Conchalí', 'Independencia', 'Recoleta', 'Huechuraba',
  'San Ramón', 'La Granja', 'San Miguel', 'San Joaquín', 'Pedro Aguirre Cerda',
  'La Pintana', 'El Bosque', 'La Cisterna',
];

const TODAS_LAS_COMUNAS = [
  ...COMUNAS_ENVIO_4000,
  'Arica', 'Iquique', 'Alto Hospicio', 'Antofagasta', 'Calama', 'Copiapó',
  'La Serena', 'Coquimbo', 'Valparaíso', 'Viña del Mar', 'Quilpué',
  'Villa Alemana', 'Concón', 'San Antonio', 'Rancagua', 'Talca', 'Curicó',
  'Linares', 'Chillán', 'Concepción', 'Talcahuano', 'Los Ángeles', 'Temuco',
  'Valdivia', 'Osorno', 'Puerto Montt', 'Coyhaique', 'Punta Arenas', 'Otra comuna',
].sort((a, b) => {
  const aHasEnvio = COMUNAS_ENVIO_4000.includes(a);
  const bHasEnvio = COMUNAS_ENVIO_4000.includes(b);
  if (aHasEnvio && !bHasEnvio) return -1;
  if (!aHasEnvio && bHasEnvio) return 1;
  return a.localeCompare(b);
});

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(9, 'Teléfono inválido'),
  address1: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  address2: z.string().optional(),
  comuna: z.string().min(2, 'Comuna requerida'),
  state: z.string().min(2, 'Región requerida'),
  postcode: z.string().min(4, 'Código postal requerido'),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('payku');
  const [selectedComuna, setSelectedComuna] = useState('');

  const { data: wooGateways = [], isLoading: isLoadingGateways } = useQuery({
    queryKey: ['payment-gateways'],
    queryFn: () => wooApi.getPaymentGateways(),
  });

  const paymentGateways = [
    {
      id: 'payku',
      title: 'Payku - Pago en Línea',
      description: 'Tarjeta de crédito, débito o transferencia bancaria',
      enabled: true,
    },
    ...wooGateways.filter(g => g.enabled),
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  const isEnvioPorPagar = selectedComuna && !COMUNAS_ENVIO_4000.includes(selectedComuna);
  const shippingCost = isEnvioPorPagar ? 0 : 4000;
  const finalTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-5">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">
            Carrito
          </p>
          <h1 className="text-2xl font-display uppercase tracking-wide mb-4">
            Tu carrito está vacío
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Agrega productos para continuar
          </p>
          <Link
            to="/tienda"
            className="inline-block bg-black text-white text-xs uppercase tracking-wider px-8 py-4 hover:bg-gray-900 transition-colors"
          >
            Ir a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      const selectedGateway = paymentGateways.find(g => g.id === paymentMethod);
      const isPaiku = paymentMethod.toLowerCase().includes('paiku') ||
                      paymentMethod.toLowerCase().includes('payku');

      if (isPaiku) {
        const orderId = `ORDER-${Date.now()}`;
        const paikuData = {
          order_id: orderId,
          email: data.email,
          amount: Math.round(finalTotal),
          billing: {
            first_name: data.firstName,
            last_name: data.lastName,
            address_1: data.address1,
            address_2: data.address2 || '',
            city: data.comuna,
            state: data.state,
            postcode: data.postcode,
            phone: data.phone,
          },
          line_items: items.map((item) => {
            const meta_data: { key: string; value: string }[] = [];

            // Agregar metadatos de grabado láser
            if (item.customization?.laserEngraving?.enabled) {
              meta_data.push({
                key: 'Grabado Láser',
                value: item.customization.laserEngraving.text,
              });
              meta_data.push({
                key: 'Precio Grabado',
                value: `$${item.customization.laserEngraving.price.toLocaleString('es-CL')}`,
              });
            }

            // Agregar metadatos de cambio de paño
            if (item.customization?.clothChange) {
              meta_data.push({
                key: 'Dimensiones Mesa',
                value: item.customization.clothChange.dimensions,
              });
              meta_data.push({
                key: 'Color Paño',
                value: item.customization.clothChange.color,
              });
              meta_data.push({
                key: 'Área',
                value: item.customization.clothChange.area,
              });
            }

            // Agregar variaciones como metadatos
            if (item.variation) {
              Object.entries(item.variation).forEach(([key, value]) => {
                meta_data.push({ key, value });
              });
            }

            return {
              product_id: item.productId,
              name: item.name,
              quantity: item.quantity,
              price: item.price,
              variation_id: item.variationId,
              ...(meta_data.length > 0 && { meta_data }),
            };
          }),
          shipping_cost: shippingCost,
          envio_por_pagar: isEnvioPorPagar,
        };

        const response = await fetch('/api/paiku/create-transaction.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paikuData),
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Error al procesar el pago');
        }

        clearCart();

        if (result.payment_url) {
          const encodedUrl = encodeURIComponent(result.payment_url);
          navigate(`/procesando-pago?redirect=${encodedUrl}&order=${result.order_id || ''}`);
        } else {
          throw new Error('No se recibió URL de pago');
        }

      } else {
        const orderData = {
          payment_method: paymentMethod,
          payment_method_title: selectedGateway?.title || 'Pago',
          set_paid: false,
          billing: {
            first_name: data.firstName,
            last_name: data.lastName,
            address_1: data.address1,
            address_2: data.address2 || '',
            city: data.comuna,
            state: data.state,
            postcode: data.postcode,
            country: 'CL',
            email: data.email,
            phone: data.phone,
          },
          shipping: {
            first_name: data.firstName,
            last_name: data.lastName,
            address_1: data.address1,
            address_2: data.address2 || '',
            city: data.comuna,
            state: data.state,
            postcode: data.postcode,
            country: 'CL',
          },
          line_items: items.map((item) => {
            const meta_data: { key: string; value: string }[] = [];

            // Agregar metadatos de grabado láser
            if (item.customization?.laserEngraving?.enabled) {
              meta_data.push({
                key: 'Grabado Láser',
                value: item.customization.laserEngraving.text,
              });
              meta_data.push({
                key: 'Precio Grabado',
                value: `$${item.customization.laserEngraving.price.toLocaleString('es-CL')}`,
              });
            }

            // Agregar metadatos de cambio de paño
            if (item.customization?.clothChange) {
              meta_data.push({
                key: 'Dimensiones Mesa',
                value: item.customization.clothChange.dimensions,
              });
              meta_data.push({
                key: 'Color Paño',
                value: item.customization.clothChange.color,
              });
              meta_data.push({
                key: 'Área',
                value: item.customization.clothChange.area,
              });
            }

            // Agregar variaciones como metadatos
            if (item.variation) {
              Object.entries(item.variation).forEach(([key, value]) => {
                meta_data.push({ key, value });
              });
            }

            return {
              product_id: item.productId,
              quantity: item.quantity,
              variation_id: item.variationId,
              ...(meta_data.length > 0 && { meta_data }),
            };
          }),
          shipping_lines: [
            {
              method_id: isEnvioPorPagar ? 'local_pickup' : 'flat_rate',
              method_title: isEnvioPorPagar ? 'Envío por pagar' : 'Envío Estándar',
              total: shippingCost.toString(),
            },
          ],
        };

        const order = await wooApi.createOrder(orderData);

        if (order.payment_url && order.payment_url !== '') {
          clearCart();
          const encodedUrl = encodeURIComponent(order.payment_url);
          navigate(`/procesando-pago?redirect=${encodedUrl}&order=${order.id}`);
        } else {
          toast.success('¡Pedido realizado!');
          clearCart();
          navigate(`/pedido-confirmado?order=${order.id}`);
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(error instanceof Error ? error.message : 'Error al procesar el pedido');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            to="/tienda"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-black transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            Volver
          </Link>
          <h1 className="text-2xl md:text-3xl font-display uppercase tracking-wide">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Contact */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                  Contacto
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <input
                      {...register('firstName')}
                      placeholder="Nombre"
                      className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('lastName')}
                      placeholder="Apellido"
                      className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Email"
                      className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  <div>
                    <input
                      {...register('phone')}
                      type="tel"
                      placeholder="Teléfono"
                      className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                  Dirección de envío
                </p>
                <div className="space-y-4">
                  <div>
                    <input
                      {...register('address1')}
                      placeholder="Dirección"
                      className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                    />
                    {errors.address1 && (
                      <p className="text-xs text-red-500 mt-1">{errors.address1.message}</p>
                    )}
                  </div>
                  <input
                    {...register('address2')}
                    placeholder="Depto, oficina (opcional)"
                    className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <select
                        {...register('comuna')}
                        onChange={(e) => {
                          register('comuna').onChange(e);
                          setSelectedComuna(e.target.value);
                        }}
                        className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent text-gray-900"
                      >
                        <option value="">Comuna</option>
                        <optgroup label="Envío $4.000">
                          {COMUNAS_ENVIO_4000.map((comuna) => (
                            <option key={comuna} value={comuna}>{comuna}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Envío por pagar">
                          {TODAS_LAS_COMUNAS.filter(c => !COMUNAS_ENVIO_4000.includes(c)).map((comuna) => (
                            <option key={comuna} value={comuna}>{comuna}</option>
                          ))}
                        </optgroup>
                      </select>
                      {errors.comuna && (
                        <p className="text-xs text-red-500 mt-1">{errors.comuna.message}</p>
                      )}
                    </div>
                    <div>
                      <select
                        {...register('state')}
                        className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent text-gray-900"
                      >
                        <option value="">Región</option>
                        {REGIONES_CHILE.map((region) => (
                          <option key={region.code} value={region.name}>
                            {region.name}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-xs text-red-500 mt-1">{errors.state.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="sm:w-1/2">
                    <input
                      {...register('postcode')}
                      placeholder="Código postal"
                      className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent placeholder:text-gray-400"
                    />
                    {errors.postcode && (
                      <p className="text-xs text-red-500 mt-1">{errors.postcode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                  Método de pago
                </p>
                {isLoadingGateways ? (
                  <p className="text-sm text-gray-500">Cargando...</p>
                ) : (
                  <div className="space-y-2">
                    {paymentGateways.map((gateway) => (
                      <label
                        key={gateway.id}
                        className={`flex items-start gap-3 p-4 border cursor-pointer transition-colors ${
                          paymentMethod === gateway.id
                            ? 'border-black'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={gateway.id}
                          checked={paymentMethod === gateway.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mt-0.5"
                        />
                        <div>
                          <p className="text-sm text-gray-900">{gateway.title}</p>
                          {gateway.description && (
                            <p className="text-xs text-gray-500 mt-0.5">{gateway.description}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit - Desktop */}
              <div className="hidden lg:block pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white text-xs uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Procesando...' : 'Realizar pedido'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-8">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                Resumen
              </p>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-[#f5f5f5] flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Cant: {item.quantity}</p>
                    </div>
                    <p className="text-sm text-gray-900 flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Envío</span>
                  <span>
                    {!selectedComuna ? (
                      <span className="text-gray-400">-</span>
                    ) : isEnvioPorPagar ? (
                      <span className="text-gray-900">Por pagar</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg pt-3 border-t border-gray-200">
                  <span>Total</span>
                  <span>
                    {isEnvioPorPagar ? `${formatPrice(total)} + envío` : formatPrice(finalTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Submit */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-lg">
              {isEnvioPorPagar ? `${formatPrice(total)} + envío` : formatPrice(finalTotal)}
            </span>
          </div>
          <button
            type="submit"
            form="checkout-form"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className="w-full bg-black text-white text-xs uppercase tracking-wider py-4 hover:bg-gray-900 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Procesando...' : 'Realizar pedido'}
          </button>
        </div>

        {/* Spacer for mobile */}
        <div className="h-32 lg:hidden" />
      </div>
    </div>
  );
}
