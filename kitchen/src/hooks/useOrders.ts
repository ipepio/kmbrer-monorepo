import { useEffect } from 'react';
import { useOrdersContext } from '@/context/OrderContext';
import { useRestaurantContext } from '@/context/RestaurantContext';
import { useSocketContext } from '@/context/SocketContext';
import useAxios from "@/hooks/useAxios"

const useOrders = () => {
  const { setOrders, setNotifications } = useOrdersContext();
  const { restaurantId } = useRestaurantContext();
  const { socket } = useSocketContext();
  const axiosInstance = useAxios();

  useEffect(() => {
    if (!restaurantId) return;

    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('/api/orders/items');
        setOrders(response.data.order_items);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    const setupSocket = () => {
      if (!socket) return;

      socket.emit('joinRoom', `restaurant_${restaurantId}`);

      socket.on('orderUpdate', (updatedOrders) => {
        if (!Array.isArray(updatedOrders)) {
          // console.error('Received invalid data for orderUpdate:', updatedOrders);
          fetchOrders();
          return; 
        }
      
        setOrders((prevOrders) => {
          const newOrders = updatedOrders.filter(
            (order) => !prevOrders.some((o) => o.orderItemId === order.orderItemId)
          );
          return [...newOrders, ...prevOrders];
        });
      });
      

      socket.on('callWaiter', (notification) => {
        console.log("notificaction from backend")
        setNotifications((prev) => [notification, ...prev]);
      });

      return () => {
        socket.emit('leaveRoom', restaurantId);
        socket.off('orderUpdate');
        socket.off('callWaiter');
      };
    };

    fetchOrders();
    const cleanupSocket = setupSocket();

    return () => {
      if (cleanupSocket) cleanupSocket();
    };
  }, [restaurantId, setOrders, setNotifications, socket]);
};

export default useOrders;
