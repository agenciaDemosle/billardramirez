import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface PoolTableTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PoolTableTypeModal({ isOpen, onClose }: PoolTableTypeModalProps) {
  const navigate = useNavigate();

  const handleTypeSelection = (type: 'profesional' | 'recreacional') => {
    onClose();

    if (type === 'profesional') {
      navigate('/tienda?categoria=superficie-en-piedra');
    } else {
      navigate('/tienda?categoria=superficie-en-madera');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white shadow-xl w-full max-w-2xl"
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors z-10"
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="text-center p-8 pb-0">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2">
                  Cotiza tu mesa
                </p>
                <h2 className="text-2xl md:text-3xl font-display uppercase tracking-wide">
                  ¿Qué tipo de mesa buscas?
                </h2>
              </div>

              {/* Options */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Profesional */}
                  <button
                    onClick={() => handleTypeSelection('profesional')}
                    className="group text-left border border-gray-200 p-6 hover:border-black transition-colors"
                  >
                    <div className="aspect-[4/3] bg-[#f5f5f5] mb-4 overflow-hidden">
                      <img
                        src="/images/fotos/mesas-de-pool.png"
                        alt="Mesa Profesional"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                      Superficie pizarra
                    </p>
                    <h3 className="text-lg font-display uppercase tracking-wide mb-2">
                      Mesa Profesional
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Torneos, negocios y jugadores exigentes
                    </p>
                    <span className="text-xs uppercase tracking-wider text-black border-b border-black pb-0.5 group-hover:border-gray-400 transition-colors">
                      Ver mesas
                    </span>
                  </button>

                  {/* Recreacional */}
                  <button
                    onClick={() => handleTypeSelection('recreacional')}
                    className="group text-left border border-gray-200 p-6 hover:border-black transition-colors"
                  >
                    <div className="aspect-[4/3] bg-[#f5f5f5] mb-4 overflow-hidden">
                      <img
                        src="/images/fotos/familia-feliz.png"
                        alt="Mesa Recreacional"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                      Superficie madera
                    </p>
                    <h3 className="text-lg font-display uppercase tracking-wide mb-2">
                      Mesa Recreacional
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Uso familiar y entretenimiento en casa
                    </p>
                    <span className="text-xs uppercase tracking-wider text-black border-b border-black pb-0.5 group-hover:border-gray-400 transition-colors">
                      Ver mesas
                    </span>
                  </button>
                </div>

                {/* Ver todas */}
                <div className="text-center mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      onClose();
                      navigate('/tienda?categoria=mesas-de-pool');
                    }}
                    className="text-sm text-gray-500 hover:text-black transition-colors"
                  >
                    Ver todas las mesas
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
