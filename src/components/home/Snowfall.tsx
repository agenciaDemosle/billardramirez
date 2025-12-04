import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  opacity: number;
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Crear 50 copos de nieve con propiedades aleatorias
    const flakes: Snowflake[] = [];
    for (let i = 0; i < 50; i++) {
      flakes.push({
        id: i,
        left: Math.random() * 100,
        animationDuration: 5 + Math.random() * 10,
        animationDelay: Math.random() * 5,
        size: 4 + Math.random() * 12,
        opacity: 0.4 + Math.random() * 0.6,
      });
    }
    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute animate-snowfall"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            opacity: flake.opacity,
          }}
        >
          <svg
            width={flake.size}
            height={flake.size}
            viewBox="0 0 24 24"
            fill="white"
            className="drop-shadow-lg"
          >
            <path d="M12 0L13.5 4.5L18 3L14.5 6.5L19 8L14.5 9.5L18 12L13.5 10.5L12 15L10.5 10.5L6 12L9.5 9.5L5 8L9.5 6.5L6 3L10.5 4.5L12 0Z" />
          </svg>
        </div>
      ))}

      <style>{`
        @keyframes snowfall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
          }
          100% {
            transform: translateY(110vh) rotate(360deg);
          }
        }

        .animate-snowfall {
          animation: snowfall linear infinite;
        }
      `}</style>
    </div>
  );
}
