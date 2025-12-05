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

// Comunas con envío a $4.000 (solo estas de la RM)
const COMUNAS_ENVIO_4000 = [
  'Colina', 'San Bernardo', 'Puente Alto', 'Padre Hurtado', 'La Florida',
  'Peñalolén', 'Ñuñoa', 'Macul', 'Las Condes', 'Vitacura', 'Lo Barnechea',
  'La Reina', 'Lo Prado', 'Cerrillos', 'Maipú', 'Pudahuel', 'Santiago Centro',
  'Estación Central', 'Quinta Normal', 'Providencia', 'Lo Espejo', 'Quilicura',
  'Cerro Navia', 'Renca', 'Conchalí', 'Independencia', 'Recoleta', 'Huechuraba',
  'San Ramón', 'La Granja', 'San Miguel', 'San Joaquín', 'Pedro Aguirre Cerda',
  'La Pintana', 'El Bosque', 'La Cisterna',
];

// Mapeo completo de comunas por región
const COMUNAS_POR_REGION: Record<string, string[]> = {
  'Arica y Parinacota': ['Arica', 'Camarones', 'General Lagos', 'Putre'],
  'Tarapacá': ['Alto Hospicio', 'Camiña', 'Colchane', 'Huara', 'Iquique', 'Pica', 'Pozo Almonte'],
  'Antofagasta': ['Antofagasta', 'Calama', 'María Elena', 'Mejillones', 'Ollagüe', 'San Pedro de Atacama', 'Sierra Gorda', 'Taltal', 'Tocopilla'],
  'Atacama': ['Alto del Carmen', 'Caldera', 'Chañaral', 'Copiapó', 'Diego de Almagro', 'Freirina', 'Huasco', 'Tierra Amarilla', 'Vallenar'],
  'Coquimbo': ['Andacollo', 'Canela', 'Combarbalá', 'Coquimbo', 'Illapel', 'La Higuera', 'La Serena', 'Los Vilos', 'Monte Patria', 'Ovalle', 'Paiguano', 'Punitaqui', 'Río Hurtado', 'Salamanca', 'Vicuña'],
  'Valparaíso': ['Algarrobo', 'Cabildo', 'Calle Larga', 'Cartagena', 'Casablanca', 'Catemu', 'Concón', 'El Quisco', 'El Tabo', 'Hijuelas', 'Isla de Pascua', 'Juan Fernández', 'La Calera', 'La Cruz', 'La Ligua', 'Limache', 'Llaillay', 'Los Andes', 'Nogales', 'Olmué', 'Panquehue', 'Papudo', 'Petorca', 'Puchuncaví', 'Putaendo', 'Quillota', 'Quilpué', 'Quintero', 'Rinconada', 'San Antonio', 'San Esteban', 'San Felipe', 'Santa María', 'Santo Domingo', 'Valparaíso', 'Villa Alemana', 'Viña del Mar', 'Zapallar'],
  'Región Metropolitana': [
    'Alhué', 'Buin', 'Calera de Tango', 'Cerrillos', 'Cerro Navia', 'Colina', 'Conchalí', 'Curacaví', 'El Bosque', 'El Monte', 'Estación Central', 'Huechuraba', 'Independencia', 'Isla de Maipo', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Lampa', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'María Pinto', 'Melipilla', 'Ñuñoa', 'Padre Hurtado', 'Paine', 'Pedro Aguirre Cerda', 'Peñaflor', 'Peñalolén', 'Pirque', 'Providencia', 'Pudahuel', 'Puente Alto', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Bernardo', 'San Joaquín', 'San José de Maipo', 'San Miguel', 'San Pedro', 'San Ramón', 'Santiago Centro', 'Talagante', 'Tiltil', 'Vitacura'
  ],
  "O'Higgins": ['Chimbarongo', 'Chépica', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'La Estrella', 'Las Cabras', 'Litueche', 'Lolol', 'Machalí', 'Malloa', 'Marchigüe', 'Mostazal', 'Nancagua', 'Navidad', 'Olivar', 'Palmilla', 'Paredones', 'Peralillo', 'Peumo', 'Pichidegua', 'Pichilemu', 'Placilla', 'Pumanque', 'Quinta de Tilcoco', 'Rancagua', 'Rengo', 'Requínoa', 'San Fernando', 'San Vicente', 'Santa Cruz'],
  'Maule': ['Cauquenes', 'Chanco', 'Colbún', 'Constitución', 'Curepto', 'Curicó', 'Empedrado', 'Hualañé', 'Licantén', 'Linares', 'Longaví', 'Maule', 'Molina', 'Parral', 'Pelarco', 'Pelluhue', 'Pencahue', 'Rauco', 'Retiro', 'Río Claro', 'Romeral', 'Sagrada Familia', 'San Clemente', 'San Javier', 'San Rafael', 'Talca', 'Teno', 'Vichuquén', 'Villa Alegre', 'Yerbas Buenas'],
  'Ñuble': ['Bulnes', 'Chillán', 'Chillán Viejo', 'Cobquecura', 'Coelemu', 'Coihueco', 'El Carmen', 'Ninhue', 'Ñiquén', 'Pemuco', 'Pinto', 'Portezuelo', 'Quillón', 'Quirihue', 'Ránquil', 'San Carlos', 'San Fabián', 'San Ignacio', 'San Nicolás', 'Treguaco', 'Yungay'],
  'Biobío': ['Alto Biobío', 'Antuco', 'Arauco', 'Cabrero', 'Cañete', 'Chiguayante', 'Concepción', 'Contulmo', 'Coronel', 'Curanilahue', 'Florida', 'Hualpén', 'Hualqui', 'Laja', 'Lebu', 'Los Álamos', 'Los Ángeles', 'Lota', 'Mulchén', 'Nacimiento', 'Negrete', 'Penco', 'Quilaco', 'Quilleco', 'San Pedro de la Paz', 'San Rosendo', 'Santa Bárbara', 'Santa Juana', 'Talcahuano', 'Tirúa', 'Tomé', 'Tucapel', 'Yumbel'],
  'La Araucanía': ['Angol', 'Carahue', 'Cholchol', 'Collipulli', 'Cunco', 'Curacautín', 'Curarrehue', 'Ercilla', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Purén', 'Renaico', 'Saavedra', 'Temuco', 'Teodoro Schmidt', 'Toltén', 'Traiguén', 'Victoria', 'Vilcún', 'Villarrica'],
  'Los Ríos': ['Corral', 'Futrono', 'La Unión', 'Lago Ranco', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'Río Bueno', 'Valdivia'],
  'Los Lagos': ['Ancud', 'Calbuco', 'Castro', 'Chaitén', 'Chonchi', 'Cochamó', 'Curaco de Vélez', 'Dalcahue', 'Fresia', 'Frutillar', 'Futaleufú', 'Hualaihué', 'Llanquihue', 'Los Muermos', 'Maullín', 'Osorno', 'Palena', 'Puerto Montt', 'Puerto Octay', 'Puerto Varas', 'Puqueldón', 'Purranque', 'Puyehue', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Río Negro', 'San Juan de la Costa', 'San Pablo'],
  'Aysén': ['Aysén', 'Chile Chico', 'Cisnes', 'Cochrane', 'Coyhaique', 'Guaitecas', 'Lago Verde', "O'Higgins", 'Río Ibáñez', 'Tortel'],
  'Magallanes': ['Antártica', 'Cabo de Hornos', 'Laguna Blanca', 'Natales', 'Porvenir', 'Primavera', 'Punta Arenas', 'Río Verde', 'San Gregorio', 'Timaukel', 'Torres del Paine'],
};

// Lista de regiones
const REGIONES_CHILE = Object.keys(COMUNAS_POR_REGION).map((name, index) => ({
  code: ['AP', 'TA', 'AN', 'AT', 'CO', 'VS', 'RM', 'LI', 'ML', 'NB', 'BI', 'AR', 'LR', 'LL', 'AI', 'MA'][index],
  name,
}));

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
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');

  // Obtener comunas de la región seleccionada
  const comunasDisponibles = selectedRegion ? COMUNAS_POR_REGION[selectedRegion] || [] : [];

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
                    {/* Primero Región */}
                    <div>
                      <select
                        {...register('state')}
                        onChange={(e) => {
                          register('state').onChange(e);
                          setSelectedRegion(e.target.value);
                          setSelectedComuna(''); // Resetear comuna al cambiar región
                        }}
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
                    {/* Luego Comuna */}
                    <div>
                      <select
                        {...register('comuna')}
                        value={selectedComuna}
                        onChange={(e) => {
                          register('comuna').onChange(e);
                          setSelectedComuna(e.target.value);
                        }}
                        disabled={!selectedRegion}
                        className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-transparent text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <option value="">{selectedRegion ? 'Selecciona comuna' : 'Primero selecciona región'}</option>
                        {comunasDisponibles.map((comuna) => {
                          const tieneEnvio4000 = COMUNAS_ENVIO_4000.includes(comuna);
                          return (
                            <option key={comuna} value={comuna}>
                              {comuna} {tieneEnvio4000 ? '($4.000)' : '(Por pagar)'}
                            </option>
                          );
                        })}
                      </select>
                      {errors.comuna && (
                        <p className="text-xs text-red-500 mt-1">{errors.comuna.message}</p>
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
