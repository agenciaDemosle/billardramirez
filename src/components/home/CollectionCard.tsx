import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface CollectionCardProps {
  title: string;
  link: string;
  imageUrl?: string;
  backgroundColor: string;
  layout: 'horizontal' | 'vertical' | 'horizontal-multi';
  pattern?: 'dots' | 'lines' | 'circles' | 'none';
}

export default function CollectionCard({
  title,
  link,
  imageUrl,
  backgroundColor,
  layout,
  pattern = 'none'
}: CollectionCardProps) {
  const getPatternSVG = () => {
    switch (pattern) {
      case 'dots':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)"/>
          </svg>
        );
      case 'lines':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="40" y2="40" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lines)"/>
          </svg>
        );
      case 'circles':
        return (
          <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <circle cx="30%" cy="50%" r="80" fill="white" opacity="0.3"/>
            <circle cx="70%" cy="30%" r="100" fill="white" opacity="0.2"/>
            <circle cx="60%" cy="70%" r="60" fill="white" opacity="0.4"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Link to={link}>
      <div
        className={`relative overflow-hidden rounded-lg group transition-transform hover:scale-[1.02] ${
          layout === 'vertical' ? 'h-full' : 'aspect-[3/2]'
        }`}
        style={{ backgroundColor }}
      >
        {/* Patrón de fondo */}
        {getPatternSVG()}

        {/* Imagen del producto */}
        {imageUrl && (
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* Overlay oscuro para mejor legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>
        )}

        {/* Contenido: Título + Flecha */}
        <div className="relative z-10 p-6 flex items-start justify-between">
          <h3 className="text-white font-bold text-lg uppercase max-w-[70%]">
            {title}
          </h3>
          <ArrowRight className="text-accent flex-shrink-0 group-hover:translate-x-1 transition-transform" size={20} />
        </div>
      </div>
    </Link>
  );
}
