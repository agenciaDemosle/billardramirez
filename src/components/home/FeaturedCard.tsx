import { Link } from 'react-router-dom';

interface FeaturedCardProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl?: string;
  size: 'full' | 'half';
}

export default function FeaturedCard({
  title,
  description,
  buttonText,
  buttonLink,
  imageUrl,
  size
}: FeaturedCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${size === 'full' ? 'h-[400px] lg:h-[500px]' : 'h-[300px] lg:h-[400px]'}`}>
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          // Placeholder con gradiente
          <div className="w-full h-full bg-gradient-to-br from-wood via-wood-dark to-secondary">
            <div className="absolute inset-0 bg-gradient-to-t from-felt-green/30 via-transparent to-transparent"></div>
          </div>
        )}
      </div>

      {/* Overlay degradado oscuro desde la izquierda */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

      {/* Contenido */}
      <div className="relative h-full flex items-center">
        <div className="px-8 lg:px-12 max-w-xl">
          {/* Título */}
          <h3 className={`text-white font-display font-bold uppercase mb-4 ${
            size === 'full' ? 'text-3xl lg:text-5xl' : 'text-2xl lg:text-4xl'
          }`}>
            {title}
          </h3>

          {/* Descripción */}
          <p className={`text-white mb-6 ${
            size === 'full' ? 'text-base lg:text-lg' : 'text-sm lg:text-base'
          }`}>
            {description}
          </p>

          {/* Botón */}
          <Link to={buttonLink}>
            <button className="bg-accent hover:bg-accent-light text-white font-bold text-sm uppercase tracking-wide px-6 py-3 rounded transition-all transform hover:scale-105">
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
