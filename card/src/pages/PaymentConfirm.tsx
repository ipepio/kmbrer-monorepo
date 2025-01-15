import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function PaymentConfirmation() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        textAlign: 'center',
        gap: 3,
      }}
    >
      <Typography variant="h4" sx={{ color: 'success.main' }}>
        ¡Pago realizado con éxito!
      </Typography>
      <Typography variant="body1">
        Tu pedido se ha pagado correctamente. Muchas gracias!.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Volver al Inicio
      </Button>
    </Box>
  );
}
