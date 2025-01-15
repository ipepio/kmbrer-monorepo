import { useState,useEffect, useContext } from 'react';
import { Box, Typography, TextField, Button, FormControlLabel, Switch, Paper, Divider } from '@mui/material';
import useAuth from '@/hooks/useAuth'; // Ajustar la ruta al hook de autenticación
import { ThemeContext } from '@/context/ThemeContext'; // Ajustar si tu ruta es diferente
import { useNavigate } from 'react-router-dom';
export default function Settings() {
  const { authState, updateUserName, logout } = useAuth();
  const { toggleTheme, isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const [name, setName] = useState(authState.user?.name || '');

  const handleNameSave = async () => {
    // Lógica para guardar el nombre (ejemplo: actualizar en backend)
    await updateUserName(name);
  };

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    if (!authState.isAuthenticated) {
      navigate('/login');
    }
  }, [authState.isAuthenticated, navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        mt: 4,
        p: 2
      }}
      component={Paper}
      elevation={3}
    >
      <Typography variant="h5" sx={{ mb: 2 }}>
        Configuración
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 1 }}>
        Cambiar nombre de usuario
      </Typography>
      <TextField
        label="Nombre"
        variant="outlined"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleNameSave}>
        Guardar nombre
      </Button>

      <Divider sx={{ my: 2 }} />

      <FormControlLabel
        control={
          <Switch
            checked={isDarkMode}
            onChange={toggleTheme}
            color="primary"
          />
        }
        label="Modo oscuro"
      />

      <Divider sx={{ my: 2 }} />

      <Button variant="outlined" color="error" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </Box>
  );
}
