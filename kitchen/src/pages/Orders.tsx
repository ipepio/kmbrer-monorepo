import React from 'react';
import { Box } from '@mui/material';
import NotificationButton from '@/components/Orders/NotificationButton';
import OrderTable from '@/components/Orders/OrderTable';
import useOrders from '@/hooks/useOrders';

const Orders: React.FC = () => {
  useOrders(); // Ejecuta el hook para cargar las órdenes

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ alignSelf: 'flex-end' }}>
        <NotificationButton />
      </Box>
      <OrderTable />
    </Box>
  );
};

export default Orders;
