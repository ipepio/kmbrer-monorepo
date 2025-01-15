import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useOrdersContext } from '@/context/OrderContext';
import OrderRow from './OrderRow';

const OrderTable: React.FC = () => {
  const { orders } = useOrdersContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Gestión de Pedidos
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            {!isMobile && <TableCell>ID Plato</TableCell>}
            <TableCell>Nombre Plato</TableCell>
            {!isMobile && <TableCell>Comentarios</TableCell>}
            {!isMobile && <TableCell>Complementos</TableCell>}
            {!isMobile && <TableCell>Mesa</TableCell>}
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length > 0 ? (
            orders.map((order) => <OrderRow key={order.orderItemId} order={order as any} />)
          ) : (
            <TableRow>
              <TableCell colSpan={isMobile ? 3 : 7} align="center">
                No hay pedidos disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default OrderTable;
