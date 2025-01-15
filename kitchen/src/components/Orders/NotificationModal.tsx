import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Paper, Stack } from '@mui/material';
import { useOrdersContext } from '@/context/OrderContext';

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ open, onClose }) => {
  const { notifications, setNotifications } = useOrdersContext();

  const handleAccept = (id: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };
  
  const handleReject = (id: number) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== id)
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Notificaciones</DialogTitle>
      <DialogContent>
        {notifications.length === 0 ? (
          <Typography>No hay notificaciones</Typography>
        ) : (
          <Stack spacing={2}>
            {notifications.map(notification => (
              <Paper key={notification.id} sx={{ p: 2 }}>
                <Typography>{notification.message}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="success" onClick={() => handleAccept(notification.id)}>
                    Aceptar
                  </Button>
                  <Button variant="contained" color="error" onClick={() => handleReject(notification.id)}>
                    Rechazar
                  </Button>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NotificationModal;
