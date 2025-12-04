import { useState, useRef, useEffect } from 'react';
import { X, Trophy, RotateCcw, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Matter from 'matter-js';

interface PoolGameProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PoolGame({ isOpen, onClose }: PoolGameProps) {
  const [hasWon, setHasWon] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [discountCode, setDiscountCode] = useState('');
  const [cueAngle, setCueAngle] = useState(0);
  const [cuePower, setCuePower] = useState(0);
  const [isAiming, setIsAiming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const cueBallRef = useRef<Matter.Body | null>(null);
  const eightBallRef = useRef<Matter.Body | null>(null);
  const pocketsRef = useRef<Matter.Body[]>([]);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);

  const generateDiscountCode = () => {
    const codes = ['POOL10', 'BILLAR15', 'JUEGA20', 'GANA10', 'POOL15'];
    return codes[Math.floor(Math.random() * codes.length)];
  };

  const resetGame = () => {
    setHasWon(false);
    setAttempts(0);
    setDiscountCode('');
    setCuePower(0);
    setIsAiming(false);
    setShowInstructions(true);

    // Resetear posiciones de las bolas
    if (cueBallRef.current && eightBallRef.current) {
      Matter.Body.setPosition(cueBallRef.current, { x: 200, y: 250 });
      Matter.Body.setVelocity(cueBallRef.current, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(cueBallRef.current, 0);

      Matter.Body.setPosition(eightBallRef.current, { x: 600, y: 250 });
      Matter.Body.setVelocity(eightBallRef.current, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(eightBallRef.current, 0);
    }
  };

  useEffect(() => {
    if (!isOpen || !sceneRef.current) return;

    // Limpiar el juego anterior si existe
    if (engineRef.current && renderRef.current) {
      Matter.Render.stop(renderRef.current);
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
      renderRef.current.canvas.remove();
      renderRef.current.textures = {};
    }

    // Crear el motor de física
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0, scale: 0 }
    });
    engineRef.current = engine;

    // Dimensiones del canvas
    const width = 800;
    const height = 500;
    const wallThickness = 50;
    const pocketRadius = 25;

    // Crear renderer
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: '#0B5E2C',
      }
    });
    renderRef.current = render;

    // Paredes (bordes de la mesa)
    const wallOptions = {
      isStatic: true,
      render: {
        fillStyle: '#8B4513',
        strokeStyle: '#654321',
        lineWidth: 2
      },
      restitution: 0.9,
      friction: 0.1
    };

    const walls = [
      // Pared superior
      Matter.Bodies.rectangle(width / 2, wallThickness / 2, width, wallThickness, wallOptions),
      // Pared inferior
      Matter.Bodies.rectangle(width / 2, height - wallThickness / 2, width, wallThickness, wallOptions),
      // Pared izquierda
      Matter.Bodies.rectangle(wallThickness / 2, height / 2, wallThickness, height, wallOptions),
      // Pared derecha
      Matter.Bodies.rectangle(width - wallThickness / 2, height / 2, wallThickness, height, wallOptions),
    ];

    // Buchacas (pockets) en las 4 esquinas
    const pocketOptions = {
      isStatic: true,
      isSensor: true,
      render: {
        fillStyle: '#000000',
        strokeStyle: '#654321',
        lineWidth: 3
      },
      label: 'pocket'
    };

    const pockets = [
      Matter.Bodies.circle(wallThickness + 10, wallThickness + 10, pocketRadius, pocketOptions), // Superior izquierda
      Matter.Bodies.circle(width - wallThickness - 10, wallThickness + 10, pocketRadius, pocketOptions), // Superior derecha
      Matter.Bodies.circle(wallThickness + 10, height - wallThickness - 10, pocketRadius, pocketOptions), // Inferior izquierda
      Matter.Bodies.circle(width - wallThickness - 10, height - wallThickness - 10, pocketRadius, pocketOptions), // Inferior derecha
    ];
    pocketsRef.current = pockets;

    // Bola blanca (cue ball)
    const cueBall = Matter.Bodies.circle(200, height / 2, 15, {
      restitution: 0.95,
      friction: 0.05,
      frictionAir: 0.02,
      density: 0.04,
      render: {
        fillStyle: '#FFFFFF',
        strokeStyle: '#CCCCCC',
        lineWidth: 2
      },
      label: 'cueBall'
    });
    cueBallRef.current = cueBall;

    // Bola 8 (objetivo)
    const eightBall = Matter.Bodies.circle(600, height / 2, 15, {
      restitution: 0.95,
      friction: 0.05,
      frictionAir: 0.02,
      density: 0.04,
      render: {
        fillStyle: '#000000',
        strokeStyle: '#333333',
        lineWidth: 2
      },
      label: 'eightBall'
    });
    eightBallRef.current = eightBall;

    // Agregar todos los cuerpos al mundo
    Matter.World.add(engine.world, [...walls, ...pockets, cueBall, eightBall]);

    // Detectar colisiones con las buchacas
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;

        // Verificar si la bola 8 cayó en una buchaca
        if (
          (bodyA.label === 'pocket' && bodyB.label === 'eightBall') ||
          (bodyB.label === 'pocket' && bodyA.label === 'eightBall')
        ) {
          // ¡Victoria!
          if (!hasWon) {
            setHasWon(true);
            const code = generateDiscountCode();
            setDiscountCode(code);

            // Detener la física
            Matter.Engine.clear(engine);
          }
        }

        // Si la bola blanca cae en una buchaca, la devolvemos a su posición inicial
        if (
          (bodyA.label === 'pocket' && bodyB.label === 'cueBall') ||
          (bodyB.label === 'pocket' && bodyA.label === 'cueBall')
        ) {
          setTimeout(() => {
            if (cueBallRef.current) {
              Matter.Body.setPosition(cueBallRef.current, { x: 200, y: height / 2 });
              Matter.Body.setVelocity(cueBallRef.current, { x: 0, y: 0 });
              Matter.Body.setAngularVelocity(cueBallRef.current, 0);
            }
          }, 100);
        }
      });
    });

    // Ejecutar el motor
    Matter.Runner.run(engine);
    Matter.Render.run(render);

    // Manejo del mouse para apuntar y disparar
    const handleCanvasMouseDown = (e: MouseEvent) => {
      const rect = render.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Verificar si el mouse está cerca de la bola blanca
      if (cueBallRef.current) {
        const dx = mouseX - cueBallRef.current.position.x;
        const dy = mouseY - cueBallRef.current.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 50) {
          setIsAiming(true);
          setIsDragging(true);
          setShowInstructions(false);
        }
      }
    };

    const handleCanvasMouseMove = (e: MouseEvent) => {
      if (!isAiming || !cueBallRef.current) return;

      const rect = render.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const dx = mouseX - cueBallRef.current.position.x;
      const dy = mouseY - cueBallRef.current.position.y;
      const angle = Math.atan2(dy, dx);

      setCueAngle(angle);

      // Calcular potencia basado en la distancia
      const distance = Math.sqrt(dx * dx + dy * dy);
      const power = Math.min(distance / 2, 100);
      setCuePower(power);
    };

    const handleCanvasMouseUp = () => {
      if (!isAiming || !cueBallRef.current) return;

      setIsAiming(false);
      setIsDragging(false);
      setAttempts(prev => prev + 1);

      // Aplicar fuerza a la bola blanca
      const forceMagnitude = cuePower * 0.002;
      const forceX = Math.cos(cueAngle) * forceMagnitude;
      const forceY = Math.sin(cueAngle) * forceMagnitude;

      Matter.Body.applyForce(cueBallRef.current, cueBallRef.current.position, {
        x: forceX,
        y: forceY
      });

      setCuePower(0);
    };

    render.canvas.addEventListener('mousedown', handleCanvasMouseDown);
    render.canvas.addEventListener('mousemove', handleCanvasMouseMove);
    render.canvas.addEventListener('mouseup', handleCanvasMouseUp);

    // Render personalizado del taco y la bola 8
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context;

      // Dibujar el número 8 en la bola negra
      if (eightBallRef.current) {
        context.save();
        context.translate(eightBallRef.current.position.x, eightBallRef.current.position.y);

        // Círculo blanco
        context.beginPath();
        context.arc(0, 0, 8, 0, 2 * Math.PI);
        context.fillStyle = '#FFFFFF';
        context.fill();

        // Número 8
        context.fillStyle = '#000000';
        context.font = 'bold 12px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText('8', 0, 0);

        context.restore();
      }

      // Dibujar el taco cuando se está apuntando
      if (isAiming && cueBallRef.current) {
        context.save();
        context.translate(cueBallRef.current.position.x, cueBallRef.current.position.y);
        context.rotate(cueAngle);

        // Línea de puntería (más tenue)
        context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        context.lineWidth = 2;
        context.setLineDash([5, 5]);
        context.beginPath();
        context.moveTo(20, 0);
        context.lineTo(200, 0);
        context.stroke();
        context.setLineDash([]);

        // Taco
        const cueDistance = 30 + (100 - cuePower);
        context.strokeStyle = '#8B4513';
        context.lineWidth = 8;
        context.beginPath();
        context.moveTo(cueDistance, 0);
        context.lineTo(cueDistance + 150, 0);
        context.stroke();

        // Punta del taco (azul)
        context.strokeStyle = '#4169E1';
        context.lineWidth = 10;
        context.beginPath();
        context.moveTo(cueDistance, 0);
        context.lineTo(cueDistance + 20, 0);
        context.stroke();

        context.restore();
      }
    });

    // Limpieza
    return () => {
      render.canvas.removeEventListener('mousedown', handleCanvasMouseDown);
      render.canvas.removeEventListener('mousemove', handleCanvasMouseMove);
      render.canvas.removeEventListener('mouseup', handleCanvasMouseUp);

      Matter.Render.stop(render);
      Matter.World.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, [isOpen]);

  const copyDiscountCode = () => {
    navigator.clipboard.writeText(discountCode);
    alert('¡Código copiado al portapapeles!');
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100000]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[100001] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-primary to-primary-dark text-white p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <Trophy size={28} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold">Juega Billar y Gana</h2>
                    <p className="text-white/90 text-sm">Golpea la bola blanca con el taco y mete la bola 8 en una buchaca</p>
                  </div>
                </div>
              </div>

              {/* Game Content */}
              <div className="p-6">
                {!hasWon ? (
                  <>
                    {/* Instructions */}
                    {showInstructions && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4"
                      >
                        <div className="flex items-start gap-3">
                          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                          <div>
                            <h3 className="font-bold text-blue-900 mb-2">📋 Cómo jugar:</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>🎱 Haz clic en la bola blanca y arrastra para apuntar</li>
                              <li>💪 Mientras más lejos arrastres, más fuerte será el golpe</li>
                              <li>🎯 Suelta el mouse para golpear la bola con el taco</li>
                              <li>🏆 Mete la bola negra (8) en cualquier buchaca para ganar</li>
                              <li>⚡ Intentos: {attempts}</li>
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Game Stats */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 px-4 py-2 rounded-lg">
                          <span className="text-sm text-gray-600">Intentos: </span>
                          <span className="font-bold text-primary">{attempts}</span>
                        </div>
                        {isAiming && (
                          <div className="bg-primary/10 px-4 py-2 rounded-lg">
                            <span className="text-sm text-gray-600">Potencia: </span>
                            <span className="font-bold text-primary">{Math.round(cuePower)}%</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={resetGame}
                        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        <RotateCcw size={18} />
                        Reiniciar
                      </button>
                    </div>

                    {/* Game Canvas */}
                    <div className="relative">
                      <div
                        ref={sceneRef}
                        className="border-8 border-[#8B4513] rounded-lg shadow-2xl overflow-hidden mx-auto"
                        style={{ maxWidth: '800px' }}
                      />

                      {/* Potencia visual */}
                      {isAiming && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg"
                        >
                          <div className="text-xs text-gray-600 mb-1">Potencia del golpe</div>
                          <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
                              style={{ width: `${cuePower}%` }}
                            />
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </>
                ) : (
                  /* Win Screen */
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="mb-6">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ type: 'spring', duration: 0.8 }}
                        className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-2xl"
                      >
                        <Trophy size={48} className="text-white" />
                      </motion.div>
                      <h3 className="text-4xl font-bold text-gray-900 mb-2">¡Felicitaciones! 🎉</h3>
                      <p className="text-lg text-gray-600 mb-6">
                        ¡Lo lograste en {attempts} {attempts === 1 ? 'intento' : 'intentos'}!
                      </p>
                    </div>

                    {/* Discount Code */}
                    <div className="bg-gradient-to-r from-primary to-primary-dark rounded-xl p-6 mb-6">
                      <p className="text-white/90 text-sm mb-2">Tu código de descuento:</p>
                      <div className="bg-white rounded-lg p-4 mb-3">
                        <code className="text-3xl font-bold text-primary tracking-wider">{discountCode}</code>
                      </div>
                      <p className="text-white/80 text-xs mb-4">
                        🎁 10-20% de descuento en tu próxima compra
                      </p>
                      <button
                        onClick={copyDiscountCode}
                        className="w-full bg-white hover:bg-gray-100 text-primary font-bold px-6 py-3 rounded-lg transition-colors"
                      >
                        📋 Copiar Código
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          onClose();
                          window.location.href = '/tienda';
                        }}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-lg transition-colors"
                      >
                        Ir a la Tienda
                      </button>
                      <button
                        onClick={resetGame}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={18} />
                        Jugar de Nuevo
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
