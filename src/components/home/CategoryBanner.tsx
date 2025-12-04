import { Link } from 'react-router-dom';

interface CategoryBannerProps {
  category: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  imageUrl?: string;
}

export default function CategoryBanner({
  category,
  title,
  description,
  buttonText,
  buttonLink,
  imageUrl
}: CategoryBannerProps) {
  return (
    <div className="relative h-full rounded-lg overflow-hidden group">
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
            {/* Simulación de mesa de pool */}
            <div className="absolute inset-0 bg-gradient-to-t from-felt-green/30 via-transparent to-transparent"></div>
          </div>
        )}
      </div>

      {/* Overlay verde oscuro semitransparente */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary-dark/80"></div>

      {/* Elementos gráficos decorativos - líneas diagonales */}
      <div className="absolute bottom-0 left-0 w-full h-48 opacity-30 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
          {/* Líneas diagonales desde esquina inferior izquierda */}
          <line x1="0" y1="200" x2="100" y2="100" stroke="currentColor" strokeWidth="2" className="text-accent"/>
          <line x1="0" y1="200" x2="150" y2="50" stroke="currentColor" strokeWidth="1.5" className="text-accent"/>
          <line x1="0" y1="200" x2="200" y2="0" stroke="currentColor" strokeWidth="1" className="text-accent"/>

          {/* Puntos decorativos */}
          <circle cx="80" cy="120" r="3" fill="currentColor" className="text-accent"/>
          <circle cx="130" cy="80" r="2" fill="currentColor" className="text-accent"/>
          <circle cx="170" cy="30" r="2.5" fill="currentColor" className="text-accent"/>
        </svg>
      </div>

      {/* Contenido */}
      <div className="relative h-full flex flex-col justify-center p-8 lg:p-12">
        {/* Etiqueta pequeña superior */}
        <div className="mb-4">
          <span className="text-accent text-sm font-medium tracking-wider uppercase">
            {category}
          </span>
        </div>

        {/* Título principal */}
        <h2 className="text-4xl lg:text-5xl xl:text-6xl font-display font-bold text-white mb-6 leading-tight tracking-wide uppercase max-w-md">
          {title}
        </h2>

        {/* Párrafo breve */}
        <p className="text-white text-base lg:text-lg mb-8 max-w-sm leading-relaxed">
          {description}
        </p>

        {/* Botón principal */}
        <div>
          <Link to={buttonLink}>
            <button className="bg-accent hover:bg-accent-light text-white font-bold text-sm uppercase tracking-wide px-8 py-4 rounded transition-all transform hover:scale-105 hover:shadow-lg">
              {buttonText}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
