import React, { useState } from 'react';
import {
  TableRow,
  TableCell,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import { Visibility, CheckCircle, DoneAll, PendingActions, Cancel } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import useAxios from '@/hooks/useAxios';
import { useOrdersContext } from '@/context/OrderContext';

interface OrderProps {
  orderId: number;
  orderItemId: number;
  name: string;
  comments: string;
  complements: string[]; // Array de complementos
  tableId: number;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
}

interface OrderRowProps {
  order: OrderProps;
}

// Diccionario de iconos de estado
const statusIcons: Record<string, React.ReactNode> = {
  pending: <PendingActions color="primary" />,
  confirmed: <CheckCircle color="success" />,
  delivered: <DoneAll color="success" />,
  cancelled: <Cancel color="error" />,
};

const OrderRow: React.FC<OrderRowProps> = ({ order }) => {
  const axiosInstance = useAxios();
  const { setOrders } = useOrdersContext();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const updateStatus = async (newStatus: 'pending' | 'confirmed' | 'delivered') => {
  try {
          setLoading(true);
          const response = await axiosInstance.post(`/api/order-item/${order.orderItemId}/status`, { status: newStatus });
          console.log(response)
          setOrders((prevOrders) =>
            prevOrders.map((o) =>
              o.orderItemId === order.orderItemId
                ? ({ ...o, status: newStatus } as any)
                : o
            )
          );
        } catch (error) {
          console.error('Error updating status:', error);
        } finally {
          setLoading(false);
        }
      };

  return (
    <>
      <TableRow>
        {!isMobile && <TableCell>{order.orderItemId}</TableCell>}
        <TableCell>{order.name}</TableCell>
        {!isMobile && <TableCell>{order.comments}</TableCell>}
        {!isMobile && <TableCell>{order.complements.join(', ')}</TableCell>}
        {!isMobile && <TableCell>{order.tableId}</TableCell>}

        {/* Columna de Estado */}
        <TableCell>
          <Tooltip title={order.status}>
            <IconButton disabled>{statusIcons[order.status]}</IconButton>
          </Tooltip>
        </TableCell>

        {/* Columna de Acciones */}
        <TableCell>
          {order.status === 'pending' && (
            <Tooltip title="Confirmar">
              <IconButton onClick={() => updateStatus('confirmed')} disabled={loading}>
                <CheckCircle color="success" />
              </IconButton>
            </Tooltip>
          )}
          {order.status === 'confirmed' && (
            <>
              <Tooltip title="Volver a Pendiente">
                <IconButton onClick={() => updateStatus('pending')} disabled={loading}>
                  <PendingActions color="warning" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Entregar">
                <IconButton onClick={() => updateStatus('delivered')} disabled={loading}>
                  <DoneAll color="success" />
                </IconButton>
              </Tooltip>
            </>
          )}
          <Tooltip title="Ver Detalles">
            <IconButton sx={{ borderRadius: 5 }} onClick={() => setDetailsOpen(true)}>
              <Visibility color="action" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>

      {/* Modal de Detalles */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <DialogTitle>Detalles de la Orden</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>ID Orden:</strong> {order.orderId}
          </Typography>
          <Typography>
            <strong>Nombre:</strong> {order.name}
          </Typography>
          <Typography>
            <strong>Comentarios:</strong> {order.comments}
          </Typography>
          <Typography>
            <strong>Complementos:</strong> {order.complements.join(', ')}
          </Typography>
          <Typography>
            <strong>Mesa:</strong> {order.tableId}
          </Typography>
          <Typography>
            <strong>Estado:</strong> {order.status}
          </Typography>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={() => setDetailsOpen(false)}>Cerrar</IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrderRow;
