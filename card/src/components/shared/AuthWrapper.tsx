import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import useAxios from '@/hooks/useAxios';

const AuthWrapper: React.FC = () => {
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  useEffect(() => {
    const validateToken = async () => {
      try {
        const userData = localStorage.getItem("userData");
        if (!userData) {
          navigate("/scan");
          return;
        }
        const { token } = JSON.parse(userData);
        const response = await axiosInstance.get("/api/tables/validate", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.status === "success") {
          return;
        }  
        if (response.data.newToken) {
          localStorage.setItem("token", response.data.newToken);
          return;
        }  
        throw new Error("Token inválido");
      } catch (error) {
        console.error("Error validando el token:", error);
        localStorage.clear();
        navigate("/scan");
      }
    };
    validateToken();
  }, [axiosInstance, navigate]);
  return (
      <Outlet />
  );
};
export default AuthWrapper;
