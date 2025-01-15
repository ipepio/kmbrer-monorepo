import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SettingsIcon from '@mui/icons-material/Settings';

const DRAWER_WIDTH = 240;

const navigationItems = [
  { path: '/orders', label: 'Comandas', icon: <RestaurantIcon /> },
  { path: '/settings', label: 'Configuración', icon: <SettingsIcon /> },
];

export function PageLayout() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [value, setValue] = useState(location.pathname);

  useEffect(() => {
    setValue(location.pathname);
  }, [location.pathname]);

  const handleNavigation = (path: string) => {
    setValue(path);
    navigate(path);
  };

  const navigationContent = isMobile ? (
    <BottomNavigation
      value={value}
      onChange={(_, newValue) => handleNavigation(newValue)}
      sx={{
        width: '100%',
        position: 'fixed',
        bottom: 0,
        borderTop: 1,
        borderColor: 'divider',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      {navigationItems.map((item) => (
        <BottomNavigationAction
          key={item.path}
          label={item.label}
          value={item.path}
          icon={item.icon}
        />
      ))}
    </BottomNavigation>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ mt: 8 }}>
        <List>
          {navigationItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={value === item.path}
                onClick={() => handleNavigation(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  // Fondo degradado dependiendo del modo del tema
  const gradientBackground =
    theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg, #1e3a5f 0%, #1c2834 100%)'
      : 'linear-gradient(180deg, #E3F2FD 0%, #90CAF9 100%)';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          background: gradientBackground,
        }}
      >
        {navigationContent}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
            // Ajuste para móviles: resta la altura del bottom nav (56px)
            height: isMobile ? `calc(100vh - 56px)` : 'auto',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
