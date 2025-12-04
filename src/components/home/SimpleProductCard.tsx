import { Link } from 'react-router-dom';

export type StockStatus = 'available' | 'low' | 'out';

interface SimpleProductCardProps {
  id: number;
  name: string;
  brand: string;
  price: string;
  imageUrl: string;
  stockStatus: StockStatus;
  slug: string;
}

export default function SimpleProductCard({
  id,
  name,
  brand,
  price,
  imageUrl,
  stockStatus,
  slug
}: SimpleProductCardProps) {
  const getStockText = (status: StockStatus) => {
    switch (status) {
      case 'available':
        return { text: 'Disponible', color: 'text-green-600' };
      case 'low':
        return { text: 'Pocas unidades', color: 'text-orange-500' };
      case 'out':
        return { text: 'Agotado', color: 'text-gray-400' };
    }
  };

  const stock = getStockText(stockStatus);

  return (
    <Link to={`/producto/${slug}`}>
      <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group overflow-hidden h-full flex flex-col">
        {/* Zona de imagen */}
        <div className="aspect-[4/3] bg-gray-50 flex items-center justify-center p-6 overflow-hidden">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Zona de información */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Nombre del producto */}
          <h3 className="font-bold text-gray-900 uppercase text-sm mb-2 line-clamp-2 leading-tight">
            {name}
          </h3>

          {/* Marca o descripción */}
          <p className="text-xs text-gray-500 mb-3">
            {brand}
          </p>

          {/* Precio */}
          <p className="text-lg font-semibold text-gray-900 mb-3">
            {price}
          </p>

          {/* Estado de stock */}
          <div className="mt-auto">
            <span className={`text-xs font-medium ${stock.color}`}>
              {stock.text}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
