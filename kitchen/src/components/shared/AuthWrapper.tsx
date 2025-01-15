import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAxios from '@/hooks/useAxios';
import { useRestaurantContext } from '@/context/RestaurantContext';

const AuthWrapper: React.FC = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { setRestaurantId } = useRestaurantContext(); // Usar el contexto

  useEffect(() => {
    const checkUser = async () => {
      try {
        const response = await axiosInstance.get('/api/users/me?populate=restaurant');
        if (response.data) {
          const restaurantId = response.data.restaurant?.id || null; // Obtener el restaurantId
          if (restaurantId) {
            setRestaurantId(restaurantId); // Configurar en el contexto
          }
          setLoading(false);
        } else {
          navigate('/login');
        }
      } catch (error: any) {
        navigate('/login');
      }
    };

    checkUser();
  }, [axiosInstance, navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }
  return <Outlet />;
};
export default AuthWrapper;
