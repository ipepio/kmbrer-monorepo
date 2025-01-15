import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function PageNotFound() {
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
      <Typography variant="h4" sx={{ color: 'text.secondary' }}>
        404 - Página no encontrada
      </Typography>
      <Typography variant="body1">
        Lo sentimos, pero la página que buscas no existe.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Volver al Inicio
      </Button>
    </Box>
  );
}
