import { useState, useEffect, useCallback } from 'react';
import useAxios from '@/hooks/useAxios';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  error: string | null;
}

const useAuth = () => {
  const axiosInstance = useAxios();

  const [authState, setAuthState] = useState<AuthState>(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const { user } = JSON.parse(userData);
      return {
        isAuthenticated: !!user,
        user: user || null,
        error: null,
      };
    }
    return {
      isAuthenticated: false,
      user: null,
      error: null,
    };
  });

  const login = useCallback(
    async (identifier: string, password: string) => {
      try {
        const response = await axiosInstance.post('/api/auth/local', {
          identifier,
          IAM: import.meta.env.VITE_IAM,
          password,
        });
        
        if (response.data && response.data.jwt && response.data.user) {
          const { jwt, user } = response.data;
          localStorage.setItem(
            'userData',
            JSON.stringify({ token: jwt, user })
          );
          setAuthState({
            isAuthenticated: true,
            user,
            error: null,
          });
        } else {
          setAuthState((prev) => ({
            ...prev,
            error: 'No se pudo obtener token o usuario',
          }));
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.error?.message ||
          'Error al iniciar sesión. Verifica tus credenciales.';
        setAuthState((prev) => ({
          ...prev,
          error: errorMessage,
        }));
      }
    },
    [axiosInstance]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('userData');
    setAuthState({
      isAuthenticated: false,
      user: null,
      error: null,
    });
  }, []);

  const updateUserName = useCallback(
    async (newName: string) => {
        if (!authState.user || !authState.user.id) {
          setAuthState((prev) => ({
            ...prev,
            error: 'No hay un usuario autenticado para actualizar.',
          }));
          return;
        }
          try {
        const response = await axiosInstance.put(`/api/users/${authState.user.id}`, { name: newName });
        if (response.data) {
          const updatedUser = response.data;
          const userData = localStorage.getItem('userData');
          let token = null;
          if (userData) {
            token = JSON.parse(userData).token;
          }
          localStorage.setItem(
            'userData',
            JSON.stringify({ token, user: updatedUser })
          );
          setAuthState((prev) => ({
            ...prev,
            user: updatedUser,
          }));
        } else {
          setAuthState((prev) => ({
            ...prev,
            error: 'No se pudo actualizar el nombre del usuario.',
          }));
        }
      } catch (error) {
        console.error('Error updating user name:', error);
        setAuthState((prev) => ({
          ...prev,
          error: 'No se pudo actualizar el nombre del usuario.',
        }));
      }
    },
    [axiosInstance]
  );

  useEffect(() => {
    const fetchUser = async () => {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        if (!parsed.token) {
          logout();
          return;
        }

        try {
          const response = await axiosInstance.get('/api/users/me');
          if (response.data && response.data.id) {
            const updatedUser = response.data;
            localStorage.setItem(
              'userData',
              JSON.stringify({ token: parsed.token, user: updatedUser })
            );
            setAuthState({
              isAuthenticated: true,
              user: updatedUser,
              error: null,
            });
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
    };
    fetchUser();
  }, [axiosInstance, logout]);

  return {
    authState,
    login,
    logout,
    updateUserName,
  };
};

export default useAuth;
