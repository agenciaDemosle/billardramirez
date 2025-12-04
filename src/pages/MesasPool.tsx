import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MesasPool() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a la tienda con filtro de categoría "mesas-de-pool"
    navigate('/tienda?categoria=mesas-de-pool');
  }, [navigate]);

  return null;
}
