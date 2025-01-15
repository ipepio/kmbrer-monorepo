import { useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import kmbrerBlack from '@/assets/kmbrer_logo.png';
import kmbrerWhite from '@/assets/kmbrer_white.png';

import { Auth } from '@/components/Auth/Auth';
import { LoginForm, ILoginFormValues } from '@/components/Auth/LoginForm';
import useAuth from '@/hooks/useAuth';

export function Login() {
  const navigate = useNavigate();
  const theme = useTheme();
  const kmbrerLogo = theme.palette.mode === 'dark' ? kmbrerWhite : kmbrerBlack;
  const { authState, login } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const initialValues: ILoginFormValues = {
    email: '',
    password: '',
    remember: false,
  };
  const onSubmit = async (
    { email, password }: ILoginFormValues,
    actions: any
  ) => {
    try {
      await login(email, password);
    } catch (err) {
      actions.setErrors({ general: 'Ocurrió un error inesperado. Intenta de nuevo.' });
    } finally {
      actions.setSubmitting(false);
    }
  };
  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/');
    }
  }, [authState.isAuthenticated, navigate]);

  return (
    <Auth>
      <Card
        sx={{
          width: isMobile ? '100%' : '100%',
          maxWidth: 400,
          margin: isMobile ? 2 : 'auto',
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <img
            src={kmbrerLogo}
            alt="Kmbrer Logo"
            style={{
              width: '100%',
              maxWidth: 400,
              marginBottom: isMobile ? 16 : 32,
            }}
          />
          <LoginForm initialValues={initialValues} onSubmit={onSubmit} />
        </CardContent>
      </Card>
    </Auth>
  );
}
