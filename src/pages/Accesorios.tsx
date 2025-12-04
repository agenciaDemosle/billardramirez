import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Accesorios() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a la tienda con filtro de categoría "accesorios"
    navigate('/tienda?categoria=accesorios');
  }, [navigate]);

  return null;
}
