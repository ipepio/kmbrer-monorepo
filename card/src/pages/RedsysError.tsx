import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function RedsysError() {
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
      <Typography variant="h4" sx={{ color: 'error.main' }}>
        Error en el pago
      </Typography>
      <Typography variant="body1">
        Ha ocurrido un problema con la transacción. Por favor, inténtalo de nuevo.
      </Typography>
      <Button variant="contained" color="secondary" onClick={() => navigate('/')}>
        Volver al Inicio
      </Button>
    </Box>
  );
}
