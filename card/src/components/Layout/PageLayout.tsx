// import { useEffect, useState } from 'react';
import { Outlet
  // , useLocation, useNavigate 
} from 'react-router-dom';
import {
  //  useMediaQuery,
    useTheme } from '@mui/material';
import { Box } from '@mui/material';

const DRAWER_WIDTH = 240;

export function PageLayout() {
  // const location = useLocation();
  const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // const navigate = useNavigate();
  // const [value, setValue] = useState(location.pathname);

  // useEffect(() => {
  //   setValue(location.pathname);
  // }, [location.pathname]);

  // const handleNavigation = (path: string) => {
  //   setValue(path);
  //   navigate(path);
  // };

  const gradientBackground =
  theme.palette.mode === 'dark'
    ? 'linear-gradient(180deg, #2563EB 0%, #1F2937 100%)' // Azul oscuro a gris oscuro
    : 'linear-gradient(180deg, #60A5FA 0%, #F9FAFB 100%)'; // Azul claro a gris claro



  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // Ocupa exactamente la pantalla completa
        overflow: 'hidden', // Oculta cualquier contenido que desborde
      }}
    >
      <Box
        sx={{
          display: 'flex',
          height: '100%', // Asegura que ocupe el 100% del contenedor padre
          background: gradientBackground,
        }}
      >
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            overflow: 'hidden', // Impide el scroll en este nivel
            height: '100%', // Asegura que el contenido se ajuste
          }}
        >
          {/* Renderiza las rutas hijas */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
