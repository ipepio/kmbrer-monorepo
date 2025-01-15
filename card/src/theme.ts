import { createTheme } from '@mui/material/styles';

// Tema claro
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      light: '#93C5FD', // Azul claro para interacciones (más claro que el principal)
      main: '#485a7d', // Azul vibrante para acciones destacadas
      dark: '#2563EB', // Azul más oscuro para hover o estados activos
      contrastText: '#FFFFFF', // Texto blanco sobre botones primarios
    },
    secondary: {
      light: '#E2E8F0', // Gris claro para elementos secundarios
      main: '#6B7280', // Gris medio
      dark: '#4B5563', // Gris oscuro
      contrastText: '#111827', // Texto oscuro sobre botones secundarios
    },
    background: {      
      default: '#F9FAFB', // Fondo principal
      paper: '#E6EBF5', // Fondo de tarjetas, gris cálido
    },
    text: {
      primary: '#111827', // Texto principal
      secondary: '#6B7280', // Texto secundario
    },
    action: {
      active:'#485a7d', // Fondo principal
    }
  },
});

// Tema oscuro
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#3B82F6', // Azul vibrante para interacciones (más claro en modo oscuro)
      main: '#111827', // Azul principal más oscuro y suave
      dark: '#1E40AF', // Azul más profundo para estados activos o hover
      contrastText: '#F9FAFB', // Texto claro sobre botones primarios
    },
    secondary: {
      light: '#9CA3AF', // Gris claro para elementos secundarios
      main: '#6B7280', // Gris medio
      dark: '#4B5563', // Gris oscuro
      contrastText: '#FFFFFF', // Texto claro sobre botones secundarios
    },
    background: {
      default: '#1F2937', // Fondo principal
      paper: '#111827', // Fondo de tarjetas
    },
    text: {
      primary: '#F9FAFB', // Texto principal
      secondary: '#9CA3AF', // Texto secundario
    },
    action: {
      active:'#F9FAFB', // Fondo principal
    }
  },
});
